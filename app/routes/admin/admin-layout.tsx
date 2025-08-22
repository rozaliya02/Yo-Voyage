import { Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {NavItems, MobileSidebar} from "../../../components";
import { account } from "~/appwrite/client";
import { redirect } from "react-router";
import { getExistingUser, storaUserData} from "~/appwrite/auth";


export async function clientLoader() {
    try{
        const user = await account.get();
        if(user.$id){
            return redirect('/sign-in');
        }

        // const existinguser = await user.getExistingUser(user.$id);

        // if(existinguser?.status === 'user'){
        //     return redirect('/');
        // }
    } catch(e){
        console.log( 'Error to fetch', e);
    }
}


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar/>
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={"270px"} enableGestures={false} className="sidebar">
          <NavItems/>
          </SidebarComponent></aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>

  );
}

export default AdminLayout;