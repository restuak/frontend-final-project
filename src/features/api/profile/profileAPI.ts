// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import useAuthStore from "@/store/authstore";
// import ProfilePage from "./ProfilePage";

// export default function Profile() {
//   const { token, user, setAuth } = useAuthStore();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = res.data.data.user;
//         setAuth(data, token);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [token, setAuth]);

//   if (loading) {
//     return <div className="p-6 text-gray-500">Loading profile...</div>;
//   }

//   if (!user) {
//     return <div className="p-6 text-red-600">You need to log in first.</div>;
//   }

//   return (
//     <ProfilePage
//       role={user.role === "TENANT" ? "owner" : "user"}
//       isVerified={user.isVerified}
//       name={user.first_name || "Guest"}
//       email={user.email}
//       phone={user.phone_number || ""}
//     />
//   );
// }
