import { Card } from '@/components/ui/card'

import Link from 'next/link'

interface ChatCardProps {
  title: string
  timestamp: string
  id: string
}


export function ChatCard({ title,timestamp, id }: ChatCardProps) {
  return (
    <Card className="shadow-sm hover:bg-zinc-50 hover:cursor-pointer">
      <Link href={`/dashboard/chat/${id}`}>
        <div className="text-xs text-muted-foreground  px-6 pt-5 ">
          {timestamp}
        </div>
        <div className=" px-6 py-3">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </Link>


    </Card>
  )
}
