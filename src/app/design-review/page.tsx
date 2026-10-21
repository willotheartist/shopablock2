import { notFound } from "next/navigation";
export default function DesignReview() {
 if (process.env.VERCEL_ENV !== "preview") notFound();
 return <main id="main" style={{background:"#303030",padding:24,minHeight:"100vh"}}><h1 style={{fontSize:24,color:"white",marginBottom:20}}>Responsive design check · 390px</h1><iframe title="Mobile homepage preview" src="/" style={{width:390,height:844,border:0,display:"block"}}/></main>;
}
