import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const teamMembers = [
  {
    initials: 'ND',
    name: 'Niruj Deka',
    role: 'Founder & Research Lead',
    description: 'Works at the intersection of data, society, and regional development. Leads topic selection, data sourcing, analysis, and visual direction.',
  },
  {
    initials: 'SN',
    name: 'Sushmita Neog',
    role: 'Editor & Collaborator',
    description: 'Helped shape the project concept and editorial approach. Contributes to framing questions, sharpening drafts, and maintaining clarity and consistency of voice. Supports story planning and reader-first editing.',
  },
];

export default function TeamPage() {
  return (
    <div className="prose prose-lg mx-auto max-w-none dark:prose-invert lg:prose-xl prose-p:font-body prose-headings:font-display">
      <h1 className="text-4xl font-bold font-display md:text-5xl">
        Team
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Northeast in Data is a collaborative project built by researchers,
        designers, and writers from the Northeast.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 not-prose sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <Avatar className='h-12 w-12 text-lg'>
                    <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm italic text-muted-foreground">{member.role}</p>
                </div>
            </div>
            <p className="text-base text-foreground/80">
              {member.description}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-16" />

      <div className="text-center not-prose">
        <p className="text-base text-muted-foreground">
          Collaborate with us:{' '}
          <a href="mailto:hello@northeastindata.com" className="font-medium text-primary hover:underline">
            hello@northeastindata.com
          </a>
        </p>
      </div>
    </div>
  );
}
