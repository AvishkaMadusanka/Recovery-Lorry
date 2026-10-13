import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function SimplePage({ title, text }) {
  return <section className="simple-page"><p className="eyebrow">RescueNow</p><h1>{title}</h1><p>{text}</p><Link className="button button-primary" to="/find">Find a recovery lorry <ArrowRight size={18} /></Link><Link className="back-link" to="/"><ArrowLeft size={15} /> Back home</Link></section>;
}
