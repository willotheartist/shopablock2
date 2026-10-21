import Link from 'next/link';
export default function NotFound(){return <main id="main" className="not-found"><span className="eyebrow" style={{justifyContent:'center'}}>A LITTLE DETOUR</span><h1 style={{marginTop:20}}>This shop isn’t here.</h1><p>The link may have changed, or this product hasn’t launched yet.</p><Link href="/" className="btn btn-dark">Back to ShopaBlock ↗</Link></main>}
