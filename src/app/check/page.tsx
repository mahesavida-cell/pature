
/**
 * Static route for Vercel deployment verification.
 * If this route is accessible at /check, the src/app structure is correctly mapped.
 */
export default function CheckPage() {
  return (
    <div className="p-20 text-center font-headline font-bold text-2xl tracking-tighter">
      ROUTING_STATUS: <span className="text-green-600 uppercase">Active</span>
    </div>
  );
}
