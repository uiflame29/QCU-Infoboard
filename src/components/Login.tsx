import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { MOCK_USERS, TEST_CREDENTIALS, TEST_OTP } from "../data/mockData"
import qcuBackground from "../assets/QCU.jpg"

type Stage = "credentials" | "otp"

export default function Login() {
  const { setCurrentUser, setFilters, navigate, showToast } = useApp()
  const [stage, setStage] = useState<Stage>("credentials")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [errors, setErrors] = useState("")
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [frozen, setFrozen] = useState(false)
  const [timer, setTimer] = useState(600) // 10 min
  const [pendingUser, setPendingUser] = useState<typeof MOCK_USERS[0] | null>(
    null,
  )
  const [showPwd, setShowPwd] = useState(false)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (stage !== "otp") return
    const t = setInterval(() => setTimer((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [stage])

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (frozen) return
    const cred = TEST_CREDENTIALS[(username as keyof typeof TEST_CREDENTIALS)]
    if (!cred || cred.password !== password) {
      const next = attempts + 1
      setAttempts(next)
      if (next >= 3) {
        setFrozen(true)
        setErrors(
          "Account frozen after 3 failed attempts. Contact System Administrator.",
        )
      } else {
        setErrors(
          `Invalid username, password, or security code. (${3 - next} attempt${
            3 - next === 1 ? "" : "s"
          } remaining)`,
        )
      }
      return
    }
    const user = MOCK_USERS.find((u) => u.username === username)
    if (!user) {
      setErrors("Account not found.")
      return
    }
    if (user.status === "FROZEN") {
      setErrors("Account is frozen. Contact System Administrator.")
      return
    }
    setLoading(true)
    setPendingUser(user)
    setTimeout(() => {
      setLoading(false)
      setStage("otp")
      setTimer(600)
      setErrors("")
    }, 1200)
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
    if (!val && i > 0) otpRefs.current[i - 1]?.focus()
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(""))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    const entered = otp.join("")
    if (timer === 0) {
      setErrors("Security code expired. Request a new OTP to continue.")
      return
    }
    if (entered !== TEST_OTP) {
      const next = otpAttempts + 1
      setOtpAttempts(next)
      if (next >= 3) {
        setFrozen(true)
        setErrors(
          "Account frozen after 3 failed OTP attempts. Administrator has been notified.",
        )
        showToast({
          type: "error",
          title: "Account Frozen",
          body: `${pendingUser?.username} has been locked. System Admin notified.`,
        })
      } else {
        setErrors(
          `Invalid security code. (${3 - next} attempt${
            3 - next === 1 ? "" : "s"
          } remaining)`,
        )
      }
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCurrentUser(pendingUser!)
      if (pendingUser!.role === "dean") {
        setFilters((previous) => ({
          ...previous,
          college: pendingUser!.college ?? "CCS",
          program: "All",
        }))
      } else {
        setFilters((previous) => ({
          ...previous,
          college: "All",
          program: "All",
        }))
      }
      navigate(
        pendingUser!.username === "doc.atienza"
          ? "president-dashboard"
          : pendingUser!.role === "admin"
          ? "admin-dashboard"
          : pendingUser!.role === "dean"
            ? "dean-dashboard"
            : pendingUser!.role === "hr"
              ? "hr-dashboard"
              : pendingUser!.role === "spards"
                ? "spards-dashboard"
                : pendingUser!.role === "registrar"
                  ? "registrar-dashboard"
                : "exec-dashboard",
      )
      showToast({
        type: "success",
        title: `Welcome, ${pendingUser!.name.split(" ")[0]}!`,
        body: "Authenticated successfully.",
      })
    }, 800)
  }

  function handleResend() {
    setTimer(600)
    setOtp(["", "", "", "", "", ""])
    setErrors("")
    showToast({
      type: "info",
      title: "New OTP Sent",
      body: "Check your QCU email for the new code.",
    })
    otpRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F4FC" }}>
      {/* Left panel – branding */}
<div
  className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(
      145deg,
      rgba(0, 0, 128, 0.72) 0%,
      rgba(20, 20, 120, 0.68) 50%,
      rgba(15, 10, 70, 0.76) 100%
    ), url(${qcuBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }}
>
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #BB96E4, transparent)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FFD066, transparent)",
          }}
        />
        <div
          className="absolute top-1/3 right-8 w-48 h-48 rounded-full opacity-5"
          style={{ background: "#FFDBED" }}
        />

        {/* Logo area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(187,150,228,0.2)",
                border: "1.5px solid rgba(187,150,228,0.4)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  stroke="#BB96E4"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17l10 5 10-5"
                  stroke="#BB96E4"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12l10 5 10-5"
                  stroke="#FFD066"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight">
                QCU InfoBoard
              </div>
              <div
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: "#BB96E4" }}
              >
                Quezon City University
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Data
            <br />
            <span style={{ color: "#FFD066" }}>Visualization</span>
            <br />
            Platform
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            A data visualization and dashboard system for evidence-based
            institutional planning at Quezon City University.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: "◈", label: "Real-Time Analytics Dashboard" },
            { icon: "◎", label: "Role-Based Access Control (RBAC)" },
            { icon: "◉", label: "Certified Report Generation" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "#BB96E4" }}>
                {f.icon}
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div
            className="h-px mb-4"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © 2026 Quezon City University
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#200D2D" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                stroke="#BB96E4"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M2 12l10 5 10-5"
                stroke="#FFD066"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-bold text-lg" style={{ color: "#200D2D" }}>
            QCU InfoBoard
          </span>
        </div>

        <div className="w-full max-w-md">
          {stage === "credentials" ? (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#200D2D" }}
                >
                  Sign In
                </h2>
                <p className="text-sm" style={{ color: "#7B6891" }}>
                  Access is restricted to authorized QCU personnel.
                </p>
              </div>

              {errors && (
                <div
                  className="p-3 rounded-xl text-sm flex items-start gap-2"
                  style={{
                    background: "rgba(76,20,19,0.08)",
                    border: "1px solid rgba(76,20,19,0.2)",
                    color: "#C0392B",
                  }}
                >
                  <span>⚠</span>
                  <span>{errors}</span>
                </div>
              )}

              {frozen ? (
                <div
                  className="p-4 rounded-2xl text-center"
                  style={{
                    background: "rgba(76,20,19,0.06)",
                    border: "1.5px solid rgba(76,20,19,0.2)",
                  }}
                >
                  <div className="text-2xl mb-2">🔒</div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#4C1413" }}
                  >
                    Account Temporarily Frozen
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#7B6891" }}>
                    Contact your System Administrator to unlock access.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#7B6891" }}
                    >
                      Username
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base"
                        style={{ color: "#BB96E4" }}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="8"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                        style={{
                          background: "rgba(32,13,45,0.04)",
                          border: "1.5px solid rgba(32,13,45,0.12)",
                          color: "#1A0D28",
                        }}
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#7B6891" }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: "#BB96E4" }}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M7 11V7a5 5 0 0110 0v4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none"
                        style={{
                          background: "rgba(32,13,45,0.04)",
                          border: "1.5px solid rgba(32,13,45,0.12)",
                          color: "#1A0D28",
                        }}
                        placeholder="Enter your password"
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded"
                        style={{ color: "#BB96E4" }}
                      >
                        {showPwd ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <line
                              x1="1"
                              y1="1"
                              x2="23"
                              y2="23"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>


                  

                  <button
                    type="submit"
                    disabled={loading || !username || !password}
                    className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{
                      background: loading ? "rgba(187,150,228,0.5)" : "#200D2D",
                      color: "#FFFFFF",
                      cursor:
                        loading || !username || !password
                          ? "not-allowed"
                          : "pointer",
                      opacity: !username || !password ? 0.5 : 1,
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="3"
                          />
                          <path
                            d="M12 2a10 10 0 0110 10"
                            stroke="#FFFFFF"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Verifying…
                      </>
                    ) : (
                      "Sign In → Verify with OTP"
                    )}
                  </button>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStage("credentials")
                    setErrors("")
                    setOtp(["", "", "", "", "", ""])
                    setOtpAttempts(0)
                  }}
                  className="flex items-center gap-1.5 text-xs mb-4 font-medium"
                  style={{ color: "#BB96E4" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 12H5M12 5l-7 7 7 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back to Sign In
                </button>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#200D2D" }}
                >
                  Two-Factor Verification
                </h2>
                <p className="text-sm" style={{ color: "#7B6891" }}>
                  A 6-digit code was sent to{" "}
                  <strong style={{ color: "#200D2D" }}>
                    {pendingUser?.email}
                  </strong>
                </p>
              </div>

              {/* OTP Timer */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background:
                    timer < 60
                      ? "rgba(76,20,19,0.06)"
                      : "rgba(187,150,228,0.08)",
                  border: "1px solid rgba(187,150,228,0.2)",
                }}
              >
                <span className="text-xs" style={{ color: "#7B6891" }}>
                  Code expires in
                </span>
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: timer < 60 ? "#C0392B" : "#200D2D" }}
                >
                  {formatTimer(timer)}
                </span>
              </div>

              {errors && (
                <div
                  className="p-3 rounded-xl text-sm flex items-start gap-2"
                  style={{
                    background: "rgba(76,20,19,0.08)",
                    border: "1px solid rgba(76,20,19,0.2)",
                    color: "#C0392B",
                  }}
                >
                  <span>⚠</span>
                  <span>{errors}</span>
                </div>
              )}

              {frozen ? (
                <div
                  className="p-4 rounded-2xl text-center"
                  style={{
                    background: "rgba(76,20,19,0.06)",
                    border: "1.5px solid rgba(76,20,19,0.2)",
                  }}
                >
                  <div className="text-2xl mb-2">🔒</div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#4C1413" }}
                  >
                    Account Frozen
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#7B6891" }}>
                    Maximum OTP attempts reached.
                  </p>
                </div>
              ) : (
                <>
                  {/* 6 OTP inputs */}
                  <div
                    className="flex justify-center gap-2"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el
                        }}
                        className="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <button type="button" onClick={() => setOtp(TEST_OTP.split(""))}
                    className="w-full rounded-xl py-2 text-xs font-semibold"
                    style={{ background: "rgba(187,150,228,0.12)", color: "#200D2D", border: "1px solid rgba(187,150,228,0.25)" }}>
                    Use test OTP: 123456
                  </button>

                  <button
                    type="submit"
                    disabled={loading || otp.some((v) => !v)}
                    className="w-full py-3.5 rounded-2xl font-semibold text-sm"
                    style={{
                      background: otp.some((v) => !v)
                        ? "rgba(32,13,45,0.3)"
                        : "#200D2D",
                      color: "#FFFFFF",
                      cursor: otp.some((v) => !v) ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Verifying…" : "Verify & Access Dashboard"}
                  </button>

                  <div className="text-center">
                    <span className="text-xs" style={{ color: "#7B6891" }}>
                      Didn't receive the code?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-xs font-semibold underline"
                      style={{ color: "#BB96E4" }}
                    >
                      Resend Code
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
