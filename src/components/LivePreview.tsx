import { Profile, ProfessionType } from "./profileTypes";

type LivePreviewProps = {
  profile: Profile;
  compact?: boolean;
};

const templateTitles: Record<ProfessionType, string> = {
  personal: "Personal Profile",
  realtor: "Realtor Layout",
  insurance: "Insurance Layout",
  attorney: "Attorney Layout",
  financial: "Financial Advisor Layout",
  healthcare: "Healthcare Layout"
};

const socialOrder: Array<keyof Profile["socialLinks"]> = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "x",
  "venmo",
  "cashapp"
];

function LivePreview({ profile, compact = false }: LivePreviewProps) {
  const topSocials = socialOrder.filter((key) => profile.socialLinks[key]).slice(0, 3);
  const remainingSocials = socialOrder.filter((key) => profile.socialLinks[key]).slice(3);

  return (
    <section className={compact ? "preview-shell compact" : "preview-shell"}>
      <div className={`phone template-${profile.professionType}`}>
        <div className="phone-body">
          <p className="preview-label">{templateTitles[profile.professionType]}</p>

          {profile.logo ? <img className="preview-logo" src={profile.logo} alt="Brand logo preview" /> : null}

          {profile.profilePhoto ? (
            <img className="preview-photo preview-photo-img" src={profile.profilePhoto} alt="Profile preview" />
          ) : (
            <div className="preview-photo placeholder">Photo</div>
          )}

          <h3>{profile.name}</h3>
          <p className="title-line">
            {profile.title || "Professional"} {profile.company ? `• ${profile.company}` : ""}
          </p>
          <p className="bio-line">{profile.shortBio || "Your short bio appears here."}</p>

          {profile.badges.length > 0 ? (
            <div className="badge-row">
              {profile.badges
                .filter((badge) => badge.value.trim())
                .map((badge) => (
                  <span key={badge.label}>
                    {badge.label}: {badge.value}
                  </span>
                ))}
            </div>
          ) : null}

          <button type="button" className="preview-cta">
            {profile.primaryCtaLabel || "Contact Me"}
          </button>

          {topSocials.length > 0 ? (
            <div className="social-stack">
              {topSocials.map((social) => (
                <a key={social} className={`social-btn ${social}`} href={profile.socialLinks[social]}>
                  {social.toUpperCase()}
                </a>
              ))}
            </div>
          ) : null}

          {remainingSocials.length > 0 ? (
            <div className="social-stack secondary">
              {remainingSocials.map((social) => (
                <a key={social} className={`social-btn ${social}`} href={profile.socialLinks[social]}>
                  {social.toUpperCase()}
                </a>
              ))}
            </div>
          ) : null}

          <div className="contact-block">
            <p>{profile.publicPhone || "Phone not added yet"}</p>
            <p>{profile.publicEmail || "Email not added yet"}</p>
            <p>{profile.website || "Website not added yet"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LivePreview;
