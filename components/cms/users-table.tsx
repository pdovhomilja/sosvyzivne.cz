"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  inviteUser,
  toggleAdmin,
  deactivateUser,
  reactivateUser,
} from "@/actions/cms/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
};

export function UsersTable({ users }: { users: Row[] }) {
  const [email, setEmail] = useState("");
  const [pending, start] = useTransition();

  function run(fn: () => Promise<unknown>, ok: string) {
    start(async () => {
      try {
        await fn();
        toast.success(ok);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Operace selhala.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          run(() => inviteUser({ email }), "Uživatel pozván.");
          setEmail("");
        }}
      >
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={pending}>
          Pozvat
        </Button>
      </form>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-ink-muted">
            <tr>
              <th className="p-3">Jméno</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Role</th>
              <th className="p-3">Stav</th>
              <th className="p-3">Akce</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.isAdmin ? "Admin" : "—"}</td>
                <td className="p-3">{u.isActive ? "Aktivní" : "Neaktivní"}</td>
                <td className="flex gap-2 p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      run(
                        () => toggleAdmin({ id: u.id }),
                        u.isAdmin ? "Role odebrána." : "Role přidána.",
                      )
                    }
                  >
                    {u.isAdmin ? "Odebrat admina" : "Udělat adminem"}
                  </Button>
                  {u.isActive ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        run(() => deactivateUser({ id: u.id }), "Deaktivováno.")
                      }
                    >
                      Deaktivovat
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        run(() => reactivateUser({ id: u.id }), "Reaktivováno.")
                      }
                    >
                      Reaktivovat
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
