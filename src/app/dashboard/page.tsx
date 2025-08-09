"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; 
  }

  const userInitials = session.user.uName
    ? session.user.uName.split(' ').map(n => n[0]).join('').toUpperCase()
    : session.user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Management Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={session.user.uName || ''} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {session.user.uName || session.user.name}
                </span>
                {session.user.role && (
                  <Badge variant="secondary">
                    {session.user.role.rName}
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome back, {session.user.uName || session.user.name}!</CardTitle>
                <CardDescription>
                  Here's an overview of your account information
                </CardDescription>
              </CardHeader>
            </Card>

            {/* User Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>
                  Your account details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">User Code</label>
                      <p className="mt-1 text-sm text-gray-900">{session.user.uCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{session.user.uName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{session.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <div className="mt-1">
                        {session.user.role ? (
                          <Badge variant="outline">
                            {session.user.role.rName} ({session.user.rCode})
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-500">No role assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {session.user.role?.rDescription && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Role Description</label>
                        <p className="mt-1 text-sm text-gray-900">{session.user.role.rDescription}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
