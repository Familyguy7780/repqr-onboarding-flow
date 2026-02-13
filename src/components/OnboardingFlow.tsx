import { ChangeEvent, useEffect, useMemo, useState } from "react";
import LivePreview from "./LivePreview";
import { Badge, PrimaryCtaType, ProfessionType, Profile, Tone } from "./profileTypes";

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type ProfessionConfig = {
  title: string;
  descriptor: string;
  defaultCtaLabel: string;
  defaultCtaType: PrimaryCtaType;
  badgeLabels: string[];
};

const toneOptions: Tone[] = ["Professional", "Friendly", "Bold", "Premium", "Energetic"];

const professionConfig: Record<ProfessionType, ProfessionConfig> = {
  personal: {
    title: "Personal",
    descriptor: "General creator and consultant layout.",
    defaultCtaLabel: "Contact Me",
    defaultCtaType: "link",
    badgeLabels: []
  },
  realtor: {
    title: "Realtor",
    descriptor: "Listings-first layout with conversion CTA.",
    defaultCtaLabel: "Schedule Showing",
    defaultCtaType: "link",
    badgeLabels: ["License #", "Years"]
  },
  insurance: {
    title: "Insurance",
    descriptor: "Quote-forward layout for trust and clarity.",
    defaultCtaLabel: "Get a Free Quote",
    defaultCtaType: "link",
    badgeLabels: ["NPN #", "Years"]
  },
  attorney: {
    title: "Attorney",
    descriptor: "Credibility-led layout with consultation CTA.",
    defaultCtaLabel: "Schedule Consultation",
    defaultCtaType: "link",
    badgeLabels: ["Practice Area", "Jurisdiction"]
  },
  financial: {
    title: "Financial Advisor",
    descriptor: "Authority layout focused on planning outcomes.",
    defaultCtaLabel: "Schedule Consultation",
    defaultCtaType: "link",
    badgeLabels: ["Credential", "Specialty"]
  },
  healthcare: {
    title: "Healthcare",
    descriptor: "Care-first layout with appointment pathway.",
    defaultCtaLabel: "Book Appointment",
    defaultCtaType: "link",
    badgeLabels: ["Specialty", "Practice Name"]
  }
};

const initialProfile: Profile = {
  destinationEnvironment: null,
  name: "Pretend Miles",
  email: "pretend@brightlinestudio.com",
  repUrl: "repqr.me/pretendmiles",
  professionType: "personal",
  rawInput: "",
  title: "Founder",
  company: "Brightline Studio",
  tagline: "Turn first impressions into lasting engagement.",
  shortBio: "I help brands and professionals create stronger digital first impressions.",
  longDescription:
    "I help professionals turn attention into opportunity through better positioning, better clarity, and stronger calls to action. My approach combines practical strategy with human communication design. Clients use my frameworks to simplify messaging, improve response rates, and convert more conversations into outcomes. The work is collaborative, fast-moving, and focused on measurable progress.",
  primaryCtaLabel: "Contact Me",
  primaryCtaType: "link",
  primaryCtaValue: "https://repqr.me/pretendmiles",
  tone: "Professional",
  keywords: ["identity", "positioning", "engagement"],
  publicPhone: "",
  publicEmail: "pretend@brightlinestudio.com",
  website: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    x: "",
    venmo: "",
    cashapp: "",
    custom1Label: "",
    custom1Url: "",
    custom2Label: "",
    custom2Url: ""
  },
  badges: [],
  profilePhoto: null,
  logo: null,
  brandColor: "#2563eb",
  ctaCustomized: false
};

const getCompletionPercent = (profile: Profile) => {
  const socialCount = Object.entries(profile.socialLinks).filter(
    ([key, value]) =>
      !key.includes("Label") && key !== "custom1Url" && key !== "custom2Url" && value.trim().length > 0
  ).length;

  const checks = [
    profile.destinationEnvironment,
    profile.name.trim(),
    profile.title.trim(),
    profile.company.trim(),
    profile.shortBio.trim(),
    profile.primaryCtaLabel.trim(),
    profile.primaryCtaValue.trim(),
    profile.profilePhoto,
    profile.publicEmail.trim(),
    socialCount >= 2
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const inferCtaType = (text: string): PrimaryCtaType => {
  const input = text.toLowerCase();
  if (input.includes("book") || input.includes("appointment")) return "book";
  if (/\+?\d[\d\s\-()]{7,}/.test(input)) return "text";
  if (input.includes("email")) return "email";
  return "link";
};

const generateAiFields = (rawInput: string, tone: Tone, professionType: ProfessionType): Partial<Profile> => {
  const text = rawInput.trim() || "I help clients with personalized service and clear communication.";
  const words = text.split(/\s+/).filter(Boolean);
  const firstSentence = text.split(/[.!?]/).find(Boolean)?.trim() ?? text;

  const title =
    professionType === "realtor"
      ? "Licensed Realtor"
      : professionType === "insurance"
        ? "Insurance Advisor"
        : professionType === "attorney"
          ? "Attorney at Law"
          : professionType === "financial"
            ? "Financial Advisor"
            : professionType === "healthcare"
              ? "Healthcare Professional"
              : "Consultant";

  const company =
    professionType === "realtor"
      ? "Metro Realty Group"
      : professionType === "insurance"
        ? "ShieldPoint Advisors"
        : professionType === "attorney"
          ? "Summit Legal"
          : professionType === "financial"
            ? "NorthBridge Financial"
            : professionType === "healthcare"
              ? "Harbor Health Partners"
              : "Brightline Studio";

  const tagline =
    tone === "Premium"
      ? "High-trust guidance designed for meaningful outcomes."
      : tone === "Energetic"
        ? "Fast communication. Smart execution. Real momentum."
        : tone === "Friendly"
          ? "Clear, human support from first message to final decision."
          : "Strategic clarity that helps people take action confidently.";

  const shortBio = `${firstSentence}. I simplify decisions and create a better experience from first click to final conversion.`;

  const longDescription = `${firstSentence}. I work with clients who value clear communication, practical planning, and measurable results. My approach combines strategy, execution, and consistent follow-through across each stage of engagement. I build trust quickly, reduce friction in decision-making, and keep momentum high. Every recommendation is tailored to goals, timing, and audience behavior.`;

  const keywords = Array.from(new Set(words.map((word) => word.toLowerCase().replace(/[^\w]/g, ""))))
    .filter((word) => word.length >= 5)
    .slice(0, 7);

  return {
    title,
    company,
    tagline,
    shortBio,
    longDescription,
    keywords: keywords.length > 0 ? keywords : ["engagement", "growth", "trust"],
    primaryCtaType: inferCtaType(text),
    primaryCtaLabel: professionConfig[professionType].defaultCtaLabel
  };
};

const badgeValuesForProfession = (professionType: ProfessionType, currentBadges: Badge[]) => {
  const labels = professionConfig[professionType].badgeLabels;
  return labels.slice(0, 2).map((label, index) => ({
    label,
    value: currentBadges[index]?.value ?? ""
  }));
};

function OnboardingFlow() {
  const [phase, setPhase] = useState<Phase>(0);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isFading, setIsFading] = useState(false);
  const [phaseOneLoading, setPhaseOneLoading] = useState(false);
  const [aiBuilding, setAiBuilding] = useState(false);
  const [stagedText, setStagedText] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState("Copy");
  const [hasSelectedProfession, setHasSelectedProfession] = useState(false);
  const [showProfessionModal, setShowProfessionModal] = useState(false);
  const [pendingProfession, setPendingProfession] = useState<ProfessionType | null>(null);
  const [expandedSocialInputs, setExpandedSocialInputs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsFading(true);
    const timer = window.setTimeout(() => setIsFading(false), 220);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const progress = useMemo(() => getCompletionPercent(profile), [profile]);

  const connectedSocialCount = useMemo(
    () => Object.values(profile.socialLinks).filter((value) => value.trim().length > 0).length,
    [profile.socialLinks]
  );

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const startPhaseOneReveal = (environment: "scanrep" | "repqr") => {
    updateProfile({ destinationEnvironment: environment });
    setPhase(1);
    setPhaseOneLoading(true);
    setStagedText("Generating your Rep...");
    window.setTimeout(() => setStagedText("Creating your digital identity..."), 1000);
    window.setTimeout(() => {
      setPhaseOneLoading(false);
      setStagedText(null);
    }, 2000);
  };

  const applyProfession = (nextProfession: ProfessionType) => {
    setProfile((prev) => {
      const defaults = professionConfig[nextProfession];
      return {
        ...prev,
        professionType: nextProfession,
        badges: badgeValuesForProfession(nextProfession, prev.badges),
        primaryCtaLabel: prev.ctaCustomized ? prev.primaryCtaLabel : defaults.defaultCtaLabel,
        primaryCtaType: prev.ctaCustomized ? prev.primaryCtaType : defaults.defaultCtaType
      };
    });
    setHasSelectedProfession(true);
  };

  const requestProfessionChange = (nextProfession: ProfessionType) => {
    if (nextProfession === profile.professionType) return;
    if (hasSelectedProfession) {
      setPendingProfession(nextProfession);
      setShowProfessionModal(true);
      return;
    }
    applyProfession(nextProfession);
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      updateProfile({ profilePhoto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      updateProfile({ logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const buildWithAi = () => {
    const messages = [
      "Extracting your details...",
      "Writing your bio...",
      "Crafting your positioning...",
      "Selecting your best call-to-action..."
    ];
    setAiBuilding(true);
    setStagedText(messages[0]);
    messages.forEach((message, index) => {
      window.setTimeout(() => setStagedText(message), index * 650);
    });

    window.setTimeout(() => {
      const aiFields = generateAiFields(profile.rawInput, profile.tone, profile.professionType);
      setProfile((prev) => ({
        ...prev,
        ...aiFields
      }));
      setAiBuilding(false);
      setStagedText(null);
      setPhase(4);
    }, 2600);
  };

  const regenerateField = (field: "tagline" | "shortBio" | "keywords" | "primaryCtaLabel") => {
    if (field === "tagline") {
      updateProfile({ tagline: "Positioned to create momentum from every introduction." });
      return;
    }
    if (field === "shortBio") {
      updateProfile({
        shortBio:
          "I combine speed, clarity, and strategic communication to turn digital attention into high-quality conversations."
      });
      return;
    }
    if (field === "keywords") {
      updateProfile({ keywords: ["premium", "responsive", "strategy", "results"] });
      return;
    }
    updateProfile({ primaryCtaLabel: professionConfig[profile.professionType].defaultCtaLabel });
  };

  const updateSocialLink = (key: keyof Profile["socialLinks"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value
      }
    }));
  };

  const handleStartOver = () => {
    setPhase(0);
    setProfile(initialProfile);
    setPhaseOneLoading(false);
    setAiBuilding(false);
    setStagedText(null);
    setShowProfessionModal(false);
    setPendingProfession(null);
    setHasSelectedProfession(false);
    setExpandedSocialInputs({});
    setCopyFeedback("Copy");
  };

  return (
    <main className="onboarding-root">
      <div className={isFading ? "surface is-fading" : "surface"}>
        {phase > 0 && phase < 6 ? (
          <header className="top-progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.max(progress, 35)}%` }} />
            </div>
            <p>Setup {Math.max(progress, 35)}% Complete</p>
          </header>
        ) : null}

        {showProfessionModal ? (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Switching layouts will update your page structure and button labels.</h3>
              <p>Your information will remain. Continue?</p>
              <div className="row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    if (pendingProfession) applyProfession(pendingProfession);
                    setPendingProfession(null);
                    setShowProfessionModal(false);
                  }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setPendingProfession(null);
                    setShowProfessionModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {phase === 0 ? (
          <section className="phase">
            <p className="phase-kicker">Commitment</p>
            <h1>How do you want to use RepQR?</h1>
            <div className="grid-two">
              <button type="button" className="option-card" onClick={() => startPhaseOneReveal("scanrep")}>
                <h3>ScanRep</h3>
                <p>Your smart digital business card. Video + QR + tap identity.</p>
              </button>
              <button type="button" className="option-card" onClick={() => startPhaseOneReveal("repqr")}>
                <h3>RepQR</h3>
                <p>Turn your digital identity into a full engagement engine.</p>
              </button>
            </div>
          </section>
        ) : null}

        {phase === 1 ? (
          <section className="phase">
            {phaseOneLoading ? (
              <div className="center-loader">
                <div className="spinner" />
                <p>{stagedText}</p>
              </div>
            ) : (
              <div className="two-col">
                <div className="left-col">
                  <p className="phase-kicker">Surprise</p>
                  <h1>Your Rep is Live.</h1>
                  <p className="lead-text">Pre-seeded from checkout. This takes about 90-120 seconds.</p>
                  <div className="identity-card">
                    <div>
                      {profile.profilePhoto ? (
                        <img className="photo-frame" src={profile.profilePhoto} alt="Profile" />
                      ) : (
                        <div className="photo-frame placeholder">Photo</div>
                      )}
                      <div className="row wrap">
                        <label className="upload-button" htmlFor="step-one-photo">
                          Upload Photo
                        </label>
                        <label className="upload-button" htmlFor="step-one-logo">
                          Upload Logo
                        </label>
                      </div>
                      <input id="step-one-photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
                      <input id="step-one-logo" type="file" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                    <div>
                      <small>URL</small>
                      <div className="row between">
                        <p>{profile.repUrl}</p>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => {
                            void navigator.clipboard?.writeText(profile.repUrl);
                            setCopyFeedback("Copied");
                            window.setTimeout(() => setCopyFeedback("Copy"), 1200);
                          }}
                        >
                          {copyFeedback}
                        </button>
                      </div>
                      <small>Name</small>
                      <p>{profile.name}</p>
                      <small>Email</small>
                      <p>{profile.email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <button type="button" className="primary-button" onClick={() => setPhase(2)}>
                      Continue
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setPhase(2)}>
                      Skip
                    </button>
                  </div>
                </div>
                <LivePreview profile={profile} />
              </div>
            )}
          </section>
        ) : null}

        {phase === 2 ? (
          <section className="phase">
            <div className="two-col">
              <div className="left-col">
                <p className="phase-kicker">Clarity</p>
                <h1>Select Your Professional Category</h1>
                <div className="grid-three">
                  {(Object.keys(professionConfig) as ProfessionType[]).map((profession) => (
                    <button
                      key={profession}
                      type="button"
                      className={
                        profession === profile.professionType ? "option-card selected profession" : "option-card profession"
                      }
                      onClick={() => requestProfessionChange(profession)}
                    >
                      <h3>{professionConfig[profession].title}</h3>
                      <p>{professionConfig[profession].descriptor}</p>
                    </button>
                  ))}
                </div>
                <div className="row">
                  <button type="button" className="primary-button" onClick={() => setPhase(3)}>
                    Continue
                  </button>
                </div>
              </div>
              <LivePreview profile={profile} />
            </div>
          </section>
        ) : null}

        {phase === 3 ? (
          <section className="phase">
            <div className="two-col">
              <div className="left-col">
                <p className="phase-kicker">Expression</p>
                <h1>Define Your Positioning</h1>
                {aiBuilding ? (
                  <div className="center-loader">
                    <div className="spinner" />
                    <p>{stagedText}</p>
                  </div>
                ) : (
                  <>
                    <p className="lead-text">Describe what you do, who you serve, and how you help.</p>
                    <textarea
                      value={profile.rawInput}
                      onChange={(e) => updateProfile({ rawInput: e.target.value })}
                      placeholder="Describe your positioning..."
                    />
                    <div className="row wrap">
                      {toneOptions.map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          className={tone === profile.tone ? "chip active" : "chip"}
                          onClick={() => updateProfile({ tone })}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                    <div className="row">
                      <label className="upload-button" htmlFor="step-three-photo">
                        Upload Photo
                      </label>
                      <input id="step-three-photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                    <div className="row">
                      <button type="button" className="primary-button" onClick={buildWithAi}>
                        Build My Rep
                      </button>
                      <button type="button" className="secondary-button" onClick={() => setPhase(4)}>
                        Skip
                      </button>
                    </div>
                  </>
                )}
              </div>
              <LivePreview profile={profile} />
            </div>
          </section>
        ) : null}

        {phase === 4 ? (
          <section className="phase">
            <div className="two-col">
              <div className="left-col">
                <p className="phase-kicker">Validation</p>
                <h1>AI Results Review</h1>
                <div className="editable-grid">
                  <div className="field-card">
                    <small>AI Generated</small>
                    <label>Title</label>
                    <input value={profile.title} onChange={(e) => updateProfile({ title: e.target.value })} />
                  </div>
                  <div className="field-card">
                    <small>AI Generated</small>
                    <label>Company</label>
                    <input value={profile.company} onChange={(e) => updateProfile({ company: e.target.value })} />
                  </div>
                  <div className="field-card">
                    <small>AI Generated</small>
                    <label>Tagline</label>
                    <input value={profile.tagline} onChange={(e) => updateProfile({ tagline: e.target.value })} />
                    <button type="button" className="regen-link" onClick={() => regenerateField("tagline")}>
                      Regenerate
                    </button>
                  </div>
                  <div className="field-card">
                    <small>AI Generated</small>
                    <label>Short Bio</label>
                    <textarea
                      value={profile.shortBio}
                      onChange={(e) => updateProfile({ shortBio: e.target.value })}
                    />
                    <button type="button" className="regen-link" onClick={() => regenerateField("shortBio")}>
                      Regenerate
                    </button>
                  </div>
                  <div className="field-card">
                    <small>AI Generated</small>
                    <label>Primary CTA Label</label>
                    <input
                      value={profile.primaryCtaLabel}
                      onChange={(e) => updateProfile({ primaryCtaLabel: e.target.value, ctaCustomized: true })}
                    />
                    <button type="button" className="regen-link" onClick={() => regenerateField("primaryCtaLabel")}>
                      Regenerate
                    </button>
                  </div>
                  <div className="field-card">
                    <small>AI Generated</small>
                    <label>Keywords</label>
                    <input
                      value={profile.keywords.join(", ")}
                      onChange={(e) =>
                        updateProfile({
                          keywords: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        })
                      }
                    />
                    <button type="button" className="regen-link" onClick={() => regenerateField("keywords")}>
                      Regenerate
                    </button>
                  </div>
                </div>
                <div className="row">
                  <button type="button" className="primary-button" onClick={() => setPhase(5)}>
                    Save &amp; Continue
                  </button>
                  <button type="button" className="secondary-button" onClick={() => setPhase(3)}>
                    Back
                  </button>
                </div>
              </div>
              <LivePreview profile={profile} />
            </div>
          </section>
        ) : null}

        {phase === 5 ? (
          <section className="phase">
            <div className="two-col">
              <div className="left-col">
                <p className="phase-kicker">Strengthen Presence</p>
                <h1>Complete Your Public Presence</h1>

                <div className="section-card">
                  <h3>Primary Action</h3>
                  <input
                    placeholder="CTA Label"
                    value={profile.primaryCtaLabel}
                    onChange={(e) => updateProfile({ primaryCtaLabel: e.target.value, ctaCustomized: true })}
                  />
                  <select
                    value={profile.primaryCtaType}
                    onChange={(e) =>
                      updateProfile({ primaryCtaType: e.target.value as PrimaryCtaType, ctaCustomized: true })
                    }
                  >
                    <option value="book">book</option>
                    <option value="call">call</option>
                    <option value="text">text</option>
                    <option value="email">email</option>
                    <option value="link">link</option>
                  </select>
                  <input
                    placeholder="CTA destination"
                    value={profile.primaryCtaValue}
                    onChange={(e) => updateProfile({ primaryCtaValue: e.target.value, ctaCustomized: true })}
                  />
                </div>

                <div className="section-card">
                  <h3>Contact Block</h3>
                  <input
                    placeholder="Public phone"
                    value={profile.publicPhone}
                    onChange={(e) => updateProfile({ publicPhone: e.target.value })}
                  />
                  <input
                    placeholder="Public email"
                    value={profile.publicEmail}
                    onChange={(e) => updateProfile({ publicEmail: e.target.value })}
                  />
                  <input
                    placeholder="Website"
                    value={profile.website}
                    onChange={(e) => updateProfile({ website: e.target.value })}
                  />
                </div>

                <div className="section-card">
                  <div className="row between">
                    <h3>Social Buttons</h3>
                    <small>{connectedSocialCount >= 2 ? "Great social coverage" : "Add at least 2 socials"}</small>
                  </div>
                  <div className="social-grid">
                    {(["facebook", "instagram", "linkedin", "youtube", "tiktok", "x", "venmo", "cashapp"] as const).map(
                      (platform) => (
                        <button
                          key={platform}
                          type="button"
                          className={profile.socialLinks[platform] ? "social-toggle active" : "social-toggle"}
                          onClick={() =>
                            setExpandedSocialInputs((prev) => ({
                              ...prev,
                              [platform]: !prev[platform]
                            }))
                          }
                        >
                          {platform}
                        </button>
                      )
                    )}
                  </div>
                  {(["facebook", "instagram", "linkedin", "youtube", "tiktok", "x", "venmo", "cashapp"] as const).map(
                    (platform) =>
                      expandedSocialInputs[platform] || profile.socialLinks[platform] ? (
                        <input
                          key={platform}
                          placeholder={`${platform} URL`}
                          value={profile.socialLinks[platform]}
                          onChange={(e) => updateSocialLink(platform, e.target.value)}
                        />
                      ) : null
                  )}
                </div>

                {professionConfig[profile.professionType].badgeLabels.length > 0 ? (
                  <div className="section-card">
                    <h3>Professional Badges</h3>
                    {professionConfig[profile.professionType].badgeLabels.slice(0, 2).map((label, index) => (
                      <input
                        key={label}
                        placeholder={label}
                        value={profile.badges[index]?.value ?? ""}
                        onChange={(e) =>
                          setProfile((prev) => {
                            const badges = [...badgeValuesForProfession(prev.professionType, prev.badges)];
                            badges[index] = { label, value: e.target.value };
                            return { ...prev, badges };
                          })
                        }
                      />
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setPhase(2);
                  }}
                >
                  Change layout
                </button>

                <div className="row">
                  <button type="button" className="primary-button" onClick={() => setPhase(6)}>
                    Continue
                  </button>
                </div>
              </div>
              <LivePreview profile={profile} />
            </div>
          </section>
        ) : null}

        {phase === 6 ? (
          <section className="phase completion">
            <p className="phase-kicker">Completion</p>
            <h1>You&apos;re Ready.</h1>
            <p className="lead-text">Your page is structured and ready to share.</p>
            <div className="completion-grid">
              <div className="identity-card">
                <div className="photo-frame placeholder qr">QR</div>
                <div>
                  <small>Rep URL</small>
                  <p>{profile.repUrl}</p>
                </div>
              </div>
              <LivePreview profile={profile} compact />
            </div>
            <div className="row">
              <button type="button" className="primary-button">
                Finish
              </button>
              <button type="button" className="secondary-button" onClick={handleStartOver}>
                Start Over
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default OnboardingFlow;
