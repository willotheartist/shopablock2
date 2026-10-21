import { z } from "zod";
import { type Draft, draftSchema } from "./product";
const text = z.string().nullable();
export const proposalSchema = z.object({
  summary: z.string().max(3000),
  changes: z.object({
    title: text,
    description: text,
    brandName: text,
    price: text,
    quantity: text,
    deliveryType: z.enum(["physical", "digital"]).nullable(),
    shippingPrice: text,
    deliveryNote: text,
    options: text,
  }),
  questions: z.array(z.string()).max(8),
  copy: z.string().nullable(),
});
export type Proposal = z.infer<typeof proposalSchema>;
export function applyProposal(draft: Draft, proposal: Proposal): Draft {
  const changes = Object.fromEntries(
    Object.entries(proposal.changes).filter(([, v]) => v !== null),
  );
  return draftSchema.parse({ ...draft, ...changes });
}
