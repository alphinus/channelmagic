import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="size-12 text-destructive" />
          </div>
          <CardTitle className="text-center">Authentifizierungsfehler</CardTitle>
          <CardDescription className="text-center">
            Bei der Bestätigung deines Accounts ist ein Fehler aufgetreten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Der Bestätigungslink ist möglicherweise abgelaufen oder wurde bereits verwendet.
            Bitte versuche dich erneut anzumelden oder registriere dich erneut.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">
              Zur Anmeldung
            </Button>
          </Link>
          <Link href="/auth/signup" className="w-full">
            <Button variant="outline" className="w-full">
              Neu registrieren
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
