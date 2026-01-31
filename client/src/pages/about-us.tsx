import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
    {
        name: "Omkar",
        role: "Technical Lead & Team Head",
        initials: "OM",
        email: "omkardhakane101@gmail.com",
        linkedin: "https://www.linkedin.com/in/omkardhakane?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        description: "Omkar serves as the Technical Lead and Team Head of JanTrack. He is responsible for overall system architecture, technical decision-making, and team coordination, ensuring smooth integration of all project components."
    },
    {
        name: "Ishwari",
        role: "Statistics & Data Analysis",
        initials: "IS",
        email: "mycourselearning11@gmail.com",
        linkedin: "https://www.linkedin.com/in/ishwari-darekar-95865a369?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        description: "Ishwari is responsible for statistical analysis and data interpretation. She ensures that the data used in JanTrack is accurate, meaningful, and presented with proper analytical logic."
    },
    {
        name: "Jaskeerat",
        role: "Database & Backend Development",
        initials: "JA",
        email: "jaskeeratsingh1510@gmail.com",
        linkedin: "https://www.linkedin.com/in/jaskeerat-singh-895376379?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        description: "Jaskeerat is responsible for database management and backend development. He ensures efficient data storage, secure handling, and smooth backend operations across the platform."
    },
    {
        name: "Ashish",
        role: "Frontend & Creativity",
        initials: "AS",
        email: "ashishgholap061@gmail.com",
        linkedin: "https://www.linkedin.com/in/ashish-gholap-7a1765333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        description: "Ashish handles the user interface, user experience, and overall creative design of JanTrack. His role is to make the platform visually appealing, intuitive, and easy to understand for users."
    }
];

export default function AboutUs() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-serif font-bold text-primary">About JanTrack Mumbai</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Transforming raw data into meaningful insights.
                        </p>
                    </div>

                    {/* Intro Section */}
                    <section className="bg-muted/30 p-8 rounded-lg border border-border">
                        <p className="text-lg leading-relaxed text-foreground/80 mb-6">
                            JanTrack is a data-driven project developed by a team of passionate engineering students with the goal of presenting information in a structured, transparent, and user-friendly manner. Our focus is on transforming raw data into meaningful insights through clean design, accurate analysis, and reliable backend systems.
                        </p>
                        <p className="text-lg leading-relaxed text-foreground/80">
                            The project is built on collaboration, where each team member contributes their expertise to ensure both technical strength and professional presentation.
                        </p>
                    </section>

                    {/* Team Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center font-serif">Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {teamMembers.map((member) => (
                                <Card key={member.name} className="hover:shadow-xl transition-all duration-300 border-primary/10 flex flex-col h-full hover:scale-[1.02] bg-card/50 hover:bg-card group">
                                    <CardHeader className="flex flex-col items-center pb-2">
                                        <Avatar className="h-28 w-28 mb-4 ring-4 ring-offset-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                                            {/* Priority 1: Local Image */}
                                            <AvatarImage
                                                src={`/images/${member.name.toLowerCase()}.jpg`}
                                                alt={member.name}
                                                className="object-cover"
                                            />
                                            {/* Priority 2: DiceBear Generator */}
                                            <AvatarImage
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                                alt={member.name}
                                            />
                                            <AvatarFallback className="text-xl font-bold bg-primary/5 text-primary">
                                                {member.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                                        <CardDescription className="font-medium text-primary text-base">
                                            {member.role}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center flex-grow">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {member.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
                                        <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary/50 transition-colors" asChild>
                                            <a href={`mailto:${member.email}`} title={`Email ${member.name}`}>
                                                <Mail className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full hover:text-[#0077b5] hover:border-[#0077b5]/50 transition-colors" asChild>
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title={`${member.name}'s LinkedIn`}>
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Support Section */}
                    <section className="bg-primary/5 p-8 rounded-lg border border-primary/10">
                        <h2 className="text-2xl font-bold mb-6 text-center font-serif">Support & Feedback</h2>
                        <div className="flex flex-col md:flex-row items-center gap-6 max-w-2xl mx-auto text-center md:text-left">

                            <div>
                                <h3 className="text-xl font-bold">Rohan</h3>
                                <p className="text-primary font-medium mb-2">Project Support & Feedback</p>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Although not an official team member, Rohan plays an important role by providing valuable feedback and guidance. He helps the team improve data presentation and maintain a professional standard across the project.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact / Footer Note */}
                    <div className="text-center pt-8 border-t">
                        <p className="text-muted-foreground">
                            Have questions or suggestions? Reach out to us at <a href="mailto:contact@jantrack.mumbai" className="text-primary hover:underline">contact@jantrack.mumbai</a>
                        </p>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
