import { test } from "node:test";
import assert from "node:assert/strict";
import {
  minorUnits,
  launchChecks,
  mugDraft,
  emptyDraft,
  slugify,
  productOptions,
} from "../src/lib/v2/product";
import { applyProposal, proposalSchema } from "../src/lib/v2/assistant";
import { paymentMatches, paymentState } from "../src/lib/v2/payments";
import { tokenMatches, tokenHash, newToken } from "../src/lib/v2/security";
test("prices are exact integer pence and reject ambiguous or unsafe values", () => {
  assert.equal(minorUnits("19.99"), 1999);
  assert.equal(minorUnits("0.50"), 50);
  assert.equal(minorUnits("1.1"), 110);
  for (const s of [
    "-1",
    "1e2",
    "NaN",
    "1.999",
    "1,000",
    "Infinity",
    "",
    "10000000",
  ])
    assert.equal(minorUnits(s), null);
});
test("publishing requires every commerce prerequisite", () => {
  assert.ok(launchChecks(mugDraft, true).every((c) => c.ok));
  assert.ok(
    launchChecks(mugDraft, false).some((c) => c.key === "payments" && !c.ok),
  );
  assert.ok(launchChecks(emptyDraft, true).filter((c) => !c.ok).length >= 5);
  assert.ok(
    launchChecks({ ...mugDraft, quantity: "0" }, true).some(
      (c) => c.key === "quantity" && !c.ok,
    ),
  );
  assert.ok(
    launchChecks({ ...mugDraft, deliveryType: "digital" }, true).some(
      (c) => c.key === "delivery" && !c.ok,
    ),
  );
  assert.ok(
    launchChecks(
      { ...mugDraft, deliveryType: "digital", digitalAssetId: "file" },
      true,
    ).every((c) => c.ok),
  );
});
test("AI proposals cannot set files, publish state or ownership", () => {
  const p = proposalSchema.parse({
    summary: "A clearer title",
    changes: {
      title: "The cobalt mug",
      description: null,
      brandName: null,
      price: null,
      quantity: null,
      deliveryType: null,
      shippingPrice: null,
      deliveryNote: null,
      options: null,
      ownerId: "someone-else",
      status: "active",
      digitalAssetId: "stolen",
    },
    questions: [],
    copy: null,
  });
  const next = applyProposal(mugDraft, p);
  assert.equal(next.title, "The cobalt mug");
  assert.equal(next.price, "24");
  assert.deepEqual(next.media, mugDraft.media);
  assert.equal(next.digitalAssetId, null);
  assert.equal("ownerId" in next, false);
  assert.equal("status" in next, false);
});
test("product options and handles are normalized", () => {
  assert.equal(slugify(" My Good Thing! "), "my-good-thing");
  assert.deepEqual(
    productOptions({ ...mugDraft, options: "Blue, Blue, White, " }),
    ["Blue", "White"],
  );
});
test("only provider success releases a paid download", () => {
  assert.equal(paymentState("succeeded"), "paid");
  for (const s of [
    "processing",
    "requires_action",
    "requires_payment_method",
    "failed",
    "paid",
    "unknown",
  ])
    assert.equal(paymentState(s), "pending");
  assert.equal(paymentState("canceled"), "cancelled");
});
test("payment must match seller, order, amount and currency", () => {
  const o = { id: "order-a", amount: 2400, currency: "GBP" };
  const p = {
    sellerId: "seller-a",
    amount: 2400,
    currency: "gbp",
    metadata: { shopablockOrderId: "order-a" },
  };
  assert.equal(paymentMatches(p, o, "seller-a"), true);
  assert.equal(
    paymentMatches({ ...p, sellerId: "seller-b" }, o, "seller-a"),
    false,
  );
  assert.equal(paymentMatches({ ...p, amount: 1 }, o, "seller-a"), false);
  assert.equal(paymentMatches({ ...p, currency: "USD" }, o, "seller-a"), false);
  assert.equal(
    paymentMatches(
      { ...p, metadata: { shopablockOrderId: "other" } },
      o,
      "seller-a",
    ),
    false,
  );
});
test("private receipt tokens are high entropy and stored hashed", () => {
  const a = newToken(),
    b = newToken();
  assert.equal(a.length, 43);
  assert.notEqual(a, b);
  assert.equal(tokenMatches(a, tokenHash(a)), true);
  assert.equal(tokenMatches(b, tokenHash(a)), false);
  assert.equal(tokenMatches(a, null), false);
  assert.equal(tokenMatches("x".repeat(201), tokenHash(a)), false);
});

test('sign-in destinations cannot redirect to a different origin',async()=>{const {safeNext}=await import('../src/lib/v2/navigation');assert.equal(safeNext('/create'),'/create');for(const input of ['https://evil.example','//evil.example','/\\evil.example','/\t/evil.example','/\n/evil.example',null])assert.equal(safeNext(input),'/app');});
