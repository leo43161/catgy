import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";
export default function SearchBar() {
    return (
        <div className="flex w-full max-w-sm items-center">
            <div className="flex items-center w-full rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-1 gap-2">
                <Search />
                <Input type="email" placeholder="Buscar" className="w-full border-0 h-8 font-semibold shadow-none" />
            </div>
        </div>
    )
}
