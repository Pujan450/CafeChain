// client-unified/src/admin/pages/UserProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserProfileTabs from "../components/UserProfileTabs";
import Loader from "../components/Loader";
import { adminGetUserById, adminDeleteUser } from "../api/api";
import { ArrowLeft } from "lucide-react";

export default function UserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!id) return;
            try {
                const userData = await adminGetUserById(id);
                setUser(userData);
            } catch (err) { toast.error("Could not load user data."); } 
            finally { setIsLoading(false); }
        };
        fetchUserProfile();
    }, [id]);

    if (isLoading) return <Loader />;
    if (!user) return <div className="text-center p-8">User not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-amber-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Users
            </button>
            <div className="flex justify-between items-start gap-4">
                <UserProfileTabs user={user} />
                <div className="pt-2">
                    <button
                        onClick={async () => {
                            if (!window.confirm('Delete this user and related records?')) return;
                            try {
                                await adminDeleteUser(id);
                                navigate(-1);
                            } catch (err) { toast.error('Failed to delete user'); }
                        }}
                        className="ml-2 flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition font-medium"
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
}