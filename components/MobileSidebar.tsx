import { Sidebar, SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {NavItems} from "../components/";
import { Link } from "react-router";
const MobileSidebar = () => {

    let sidebar: SidebarComponent

    const ToggleSidebar = () => {
        {/* @ts-ignore */}
        sidebar.toggle();
    }

  return (
    <div className="mobile-sidebar wrapper ">
        <header>
            <Link to='/'>
            <img src="assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
            <h1>Tourvisto</h1>
        
            </Link>
            
            <button onClick={ToggleSidebar}>
                <img src="/assets/icons/menu.svg" alt="menu" className="size-7"/>
            </button>
        </header>
        {/* @ts-ignore */}
        <SidebarComponent width={"270px"} ref={(Sidebar) => sidebar = Sidebar} created={() => sidebar.hide()} closeOnDocumentClick={true} showBackdrop={true} type="over">
          <NavItems handleClick={ToggleSidebar}/>
        </SidebarComponent>
      
    </div>
  );
}

export default MobileSidebar;