import { useState } from 'react';
import type { Role } from '../types';
import { MoreVertical, Edit, Trash2, ChevronDown } from 'lucide-react';

interface RoleTableProps {
    roles: Role[];
    loading: boolean;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
}

const RoleCard = ({ role, onEdit, onDelete }: { role: Role; onEdit: (r: Role) => void; onDelete: (r: Role) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="mb-2">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-6 border border-gray-200 cursor-pointer flex items-center justify-between transition-all duration-200 ease-in-out hover:border-blue-500 hover:bg-gray-50
                    ${isOpen ? 'rounded-t-2xl border-b-0 bg-gray-50' : 'rounded-2xl'}
                `}
            >
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                        >
                            <MoreVertical size={20} />
                        </button>


                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                    }}
                                />
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(role);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(role);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <button className="p-1.5 rounded-full text-gray-500">
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
                        />
                    </button>
                </div>
            </div>


            {isOpen && (
                <div className="p-6 border border-gray-200 border-t-0 rounded-b-2xl bg-white animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-bold text-blue-600 mb-4">Assigned Permissions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {role.permissions.map((p) => (
                            <div
                                key={p.uuid}
                                className="p-3 rounded-2xl border border-gray-200 flex flex-col gap-1 hover:border-blue-200 transition-colors"
                            >
                                <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                <p className="text-xs text-gray-400">No description available</p>
                                <div className="mt-1">
                                    <span className="text-xs font-bold text-emerald-500">Assigned</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const RoleTable: React.FC<RoleTableProps> = ({ roles, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[70px] bg-gray-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div>
            {roles.map((role) => (
                <RoleCard key={role.uuid} role={role} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {roles.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
                    <p className="text-gray-500">No roles found.</p>
                </div>
            )}
        </div>
    );
};
