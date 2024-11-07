import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        onSearch(e.target.value); // Llama a la función de búsqueda del componente padre
    };

    return (
        <div className="flex w-full max-w-sm items-center">
            <div className="flex items-center w-full rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-1 gap-2">
                <Search />
                <Input
                    type="text"
                    placeholder="Buscar"
                    value={searchValue}
                    onChange={handleSearch}
                    className="w-full border-0 h-8 font-semibold shadow-none"
                />
            </div>
        </div>
    );
}
