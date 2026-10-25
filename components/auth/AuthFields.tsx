"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui";

const labelClass = "text-[12.5px] font-semibold text-foreground-secondary";
const fieldClass =
  "flex items-center gap-2.5 rounded-xl border bg-input-bg px-3.5 py-3 text-foreground-tertiary transition-colors focus-within:border-accent";
const inputClass = "min-w-0 flex-1 bg-transparent text-[16px] text-foreground outline-none placeholder:text-foreground-tertiary sm:text-[14px]";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  /** Shown at the right of the label, e.g. a "Forgot password?" link */
  labelAction?: ReactNode;
  /** Shown inside the field after the input, e.g. a show-password toggle */
  trailing?: ReactNode;
};

export function AuthField({ label, icon: Icon, value, onChange, invalid, labelAction, trailing, ...input }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        {labelAction}
      </span>
      <span className={`${fieldClass} ${invalid ? "border-error" : "border-input-border"}`}>
        <Icon className="size-[18px] shrink-0" />
        <input {...input} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} className={inputClass} />
        {trailing}
      </span>
    </label>
  );
}

export function PasswordField(props: Omit<FieldProps, "icon" | "type" | "trailing">) {
  const [show, setShow] = useState(false);
  return (
    <AuthField
      {...props}
      icon={Lock}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="cursor-pointer rounded-md p-0.5 text-foreground-tertiary hover:text-foreground"
        >
          {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      }
    />
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-[13px] font-medium text-error">{message}</p>;
}

export function FormNotice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="flex items-start gap-2 rounded-lg bg-success/10 px-3 py-2 text-[13px] font-medium text-success">
      <CheckCircle2 className="mt-px size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function SubmitButton({ loading, loadingText, children }: { loading: boolean; loadingText: string; children: ReactNode }) {
  return (
    <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-[14px]">
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          {loadingText}
        </>
      ) : (
        <>{children}<ArrowRight /></>
      )}
    </Button>
  );
}

export const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
