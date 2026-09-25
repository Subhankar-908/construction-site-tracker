export const API_URL=process.env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api";
export async function api(path,options={}){
 const token=typeof window!=="undefined"?localStorage.getItem("token"):null;
 const headers={...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;
 if(!(options.body instanceof FormData))headers["Content-Type"]="application/json";
 const res=await fetch(`${API_URL}${path}`,{...options,headers});
 const data=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(data.message||"Request failed");
 return data;
}
