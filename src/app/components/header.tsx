import { Button } from "@nextui-org/button"

export default function Header(){
    return(
        <header className="flex flex-row items-start p-2 bg-white w-full">
            <div className="flex title w-full p-2">
                    <h1 className="text-2xl font-bold text-black-300">Personal Activity Manager by Gabs</h1>
            </div>
            
        </header>
    )
}