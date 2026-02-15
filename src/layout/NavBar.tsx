import {  useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Modal } from "../components/Modal";

export const NavBar = () => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <nav className="bg-[#B71651] px-8 text-white p-4 space-x-4  flex items-center">
            
            <div className="relative leading-none">
                <div className="text-black">
                    {openMenu && (
                    <Modal
                        isOpen={openMenu}
                        onClose={() => setOpenMenu(false)}
                        title="Navegue por aqui sz"
                    >
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <Link to="/dashboard" className="text-lg font-bold" onClick={() => setOpenMenu(false)}>./src/dashboard</Link>
                            <Link to="/profile" className="text-lg font-bold" onClick={() => setOpenMenu(false)}>./src/meuperfil (não funcionando ainda)</Link>
                            <Link to="/files" className="text-lg font-bold" onClick={() => setOpenMenu(false)}>./src/pastas (não funcionando ainda)</Link>
                        </div>
                    </Modal>
                )}
                </div>
                <div>
                <button onClick={() => setOpenMenu(!openMenu)} className="focus:outline-none  cursor-pointer">
                    <Menu className="w-8 h-8" />
                </button>
                </div>
            </div>
            <div>
                <Link to="/dashboard" className="text-lg font-bold">Hevellyn.</Link>
            </div>
            
        </nav>
    );
}