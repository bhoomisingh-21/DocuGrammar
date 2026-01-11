import { Info as InfoIcon } from "lucide-react"; // Rename it here

export default function Info() {
  return (
    <div>
     {/* Use the new alias here */}
     <InfoIcon className="w-4 h-4 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
    </div>
  );
}