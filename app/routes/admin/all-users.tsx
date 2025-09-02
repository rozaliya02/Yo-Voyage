import { users } from '~/constants';
import { Header } from '../../../components';
import {GridComponent, ColumnsDirective, ColumnDirective} from "@syncfusion/ej2-react-grids"
import { cn, formatDate } from '~/lib/utils';
import { getAllUser } from '~/appwrite/auth';
import type { Route } from '../../routes/admin/+types/all-users';
import { UserCircle } from "lucide-react";


export const loader = async () => {
  const {users, total} = await getAllUser(10, 0)

  return {users, total};
}

const AllUsers = ({loaderData} : Route.ComponentProps) => {
const {users} = loaderData

  return (
    <main className="all-users wrapper">
      <Header title='Manage Users'
      description='Filter, sort, and access detailed user profiles' /> 

      <GridComponent dataSource={users}>
        <ColumnsDirective>
        <ColumnDirective 
        field="name"
        headerText="Name"
        width="200"
        textAlign="Left"
        template={(props: UserData) => (
          <div className='flex items-center gap-1.5 px-4'>
            {props.imageUrl ? (
              <img src={props.imageUrl} alt={props.name}
              className='rounded-full size-8 aspect-square object-cover'
              referrerPolicy='no-referrer'/>
            ) : (
              <UserCircle className='size-8 text-gray-400'/>
            )} 
            <span className='font-inter text-sm font-medium'>{props.name}</span>
            </div>
            )}
          
        />
        <ColumnDirective
        field='email'
        headerText='Email'
        width={150}
        textAlign='Left'
        />
         <ColumnDirective
        field='joinedAt'
        headerText='Date Joined'
        width={140}
        textAlign='Left'
        template={({joinedAt}: {joinedAt: string}) => formatDate(joinedAt)}
        />
         <ColumnDirective
        field='itineraryCreated'
        headerText='Trip Created'
        width={130}
        textAlign='Left'
        />
        <ColumnDirective
  field="status"
  headerText="Status"
  width={100}
  textAlign="Left"
  template={({ status }: UserData) => (
    <article
      className={cn(
        "status-column flex items-center gap-2 px-2 py-1 rounded-2xl w-fit",
        status === "user" ? "bg-success-50" : "bg-gray-100"
      )}
    >
      <span
        className={cn(
          "w-3 h-3 rounded-full",
          status === "user" ? "bg-success-500" : "bg-gray-400"
        )}
      />
      <span
        className={cn(
          "font-inter text-xs font-medium",
          status === "user" ? "text-success-700" : "text-gray-600"
        )}
      >
        {status}
      </span>
    </article>
  )}
/>

        </ColumnsDirective>
        
      </GridComponent>
    </main>
  );
}

export default AllUsers;