import { getUser } from "@/lib/user"
import Uploader from "@/components/forms/uploader"
import type{ UserType } from "@/types/user"
export default async function Page() {

  const user = await getUser() as UserType
  return (

    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Uploader subjects={user.subjects.map(i=>({subject:i.subject, code:i.serial}))} />
    </div>
  )
}
