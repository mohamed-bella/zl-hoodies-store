import Storefront from '@/components/storefront';
import {products} from '@/lib/db';
export const dynamic='force-dynamic';
export default function Home(){return <Storefront products={products()}/>;}
