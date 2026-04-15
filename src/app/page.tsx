"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthButton } from "@/components/auth-button";

type ProcessState = "idle" | "uploading" | "success" | "error";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const faqItems = [
  {
    question: "Is it free to use?",
    answer:
      "Yes. This MVP is designed as a simple free tool so users can remove a background and download the result instantly.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can upload JPG, PNG, and WEBP images up to 10MB in size.",
  },
  {
    question: "Do you store my images?",
    answer:
      "No. Images are processed in memory during the request lifecycle and are not persisted by this MVP.",
  },
  {
    question: "How long does processing take?",
    answer:
      "Most images finish in a few seconds, depending on file size and Remove.bg response time.",
  },
];

const useCases = [
  "Product photos",
  "Profile pictures",
  "Logos",
  "Signatures",
];

function formatError(message?: string) {
  if (!message) return "Something went wrong. Please try again.";
  return message;
}

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessState>("idle");
  const [error, setError] = useState<string>("");

  const isAuthenticated = Boolean(session?.user);
  const displayName = session?.user?.name || session?.user?.email || "Signed in user";

  const downloadName = useMemo(() => {
    if (!file) return "image-no-bg.png";
    const base = file.name.replace(/\.[^.]+$/, "");
    return `${base}-no-bg.png`;
  }, [file]);

  const validateFile = (nextFile: File) => {
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      return "Unsupported file type. Please upload JPG, PNG, or WEBP.";
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      return "File is too large. Please upload an image under 10MB.";
    }

    return "";
  };

  const handleFile = async (nextFile: File) => {
    const validationError = validateFile(nextFile);
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    const preview = URL.createObjectURL(nextFile);
    setFile(nextFile);
    setOriginalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return preview;
    });
    setResultPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setStatus("uploading");
    setError("");

    const formData = new FormData();
    formData.append("image", nextFile);

    try {
      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Failed to remove background. Please try again.";
        try {
          const data = (await response.json()) as { error?: string };
          message = formatError(data.error);
        } catch {
          message = formatError(message);
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setResultPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return resultUrl;
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to remove background.");
    }
  };

  const onInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    await handleFile(nextFile);
    event.target.value = "";
  };

  const onDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const nextFile = event.dataTransfer.files?.[0];
    if (!nextFile) return;
    await handleFile(nextFile);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#ffffff_50%)] text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-10 lg:px-8">
        <header className="flex flex-col gap-6 rounded-[32px] border border-white/70 bg-white/85 px-8 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:px-12 md:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-sm font-medium text-sky-700">
              AI image background remover
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {isAuthenticated && (
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="max-w-[180px]">
                    <p className="truncate font-medium text-slate-900">{displayName}</p>
                    {session?.user?.email && <p className="truncate text-xs text-slate-500">{session.user.email}</p>}
                  </div>
                </div>
              )}
              <AuthButton isAuthenticated={isAuthenticated} />
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  Remove image background instantly, online and without signup.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Upload a JPG, PNG, or WEBP image, remove the background in seconds, and download a transparent PNG ready for ecommerce, profiles, logos, and more.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">Fast processing</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">No image storage</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">Transparent PNG output</span>
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sky-700">
                  {sessionStatus === "loading"
                    ? "Checking sign-in status..."
                    : isAuthenticated
                      ? "Signed in, ready for future account features"
                      : "Sign in with Google to test the new login flow"}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/60">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">How it works</p>
              <ol className="mt-6 space-y-5 text-sm text-slate-300">
                {["Upload your image", "AI removes the background", "Download your PNG result"].map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400/20 text-sm font-semibold text-sky-200">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{step}</p>
                      <p className="mt-1 text-slate-400">
                        {index === 0 && "Drag and drop or browse from your device."}
                        {index === 1 && "We process it securely through Remove.bg."}
                        {index === 2 && "Use the transparent image anywhere you need."}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-slate-950">Upload an image</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Supported formats: JPG, PNG, WEBP. Maximum file size: 10MB.
              </p>
            </div>

            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 text-center transition ${
                dragging
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={onInputChange}
              />
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <span className="text-3xl">🖼️</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900">Drag and drop your image here</p>
                  <p className="mt-2 text-sm text-slate-500">or click to browse from your device</p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Upload image
                </button>
              </div>
            </label>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex min-h-7 items-center">
                {status === "uploading" && <p className="text-sky-700">Removing background, this usually takes a few seconds...</p>}
                {status === "success" && <p className="text-emerald-700">Background removed successfully. Your PNG is ready.</p>}
                {status === "error" && <p className="text-rose-700">{error}</p>}
                {status === "idle" && <p className="text-slate-500">No signup required. We do not store your images in this MVP.</p>}
              </div>
              <p className="text-slate-500">
                {isAuthenticated
                  ? "You are signed in. Next we can connect usage limits and payment to your account."
                  : "Google sign-in is now available for testing, but uploads still work without login."}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Preview and download</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Compare the original image with the transparent PNG result.
                </p>
              </div>
              {resultPreview && (
                <a
                  href={resultPreview}
                  download={downloadName}
                  className="rounded-full bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-500"
                >
                  Download PNG
                </a>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <PreviewCard title="Original" imageUrl={originalPreview} emptyText="Upload an image to preview the original." plain />
              <PreviewCard title="Background removed" imageUrl={resultPreview} emptyText="Your transparent result will appear here." transparent />
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Built for common image workflows</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              This MVP is designed for high-intent use cases where users want a clean transparent background fast, without learning a full editor.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {useCases.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-950">FAQ</h2>
            <div className="mt-4 space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

type PreviewCardProps = {
  title: string;
  imageUrl: string | null;
  emptyText: string;
  plain?: boolean;
  transparent?: boolean;
};

function PreviewCard({ title, imageUrl, emptyText, plain, transparent }: PreviewCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{title}</div>
      <div
        className={`flex aspect-square items-center justify-center p-4 ${
          plain ? "bg-white" : transparent ? "bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]" : ""
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="max-h-full max-w-full rounded-2xl object-contain shadow-sm" />
        ) : (
          <p className="max-w-[220px] text-center text-sm leading-6 text-slate-400">{emptyText}</p>
        )}
      </div>
    </div>
  );
}
