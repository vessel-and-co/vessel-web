"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "../actions";

const initialState: LoginState = { error: null };

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-[320px] flex-col gap-4"
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="text-xs tracking-[0.08em] text-brand-gold-soft uppercase"
        >
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="rounded-md border border-brand-gold/30 bg-transparent px-4 py-2.5 text-sm text-paper outline-none focus:border-brand-gold"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs tracking-[0.08em] text-brand-gold-soft uppercase"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-brand-gold/30 bg-transparent px-4 py-2.5 text-sm text-paper outline-none focus:border-brand-gold"
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-brand-green-950 transition-colors hover:bg-brand-gold-soft disabled:opacity-60"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}
