import { CSSProperties, useMemo } from "react";
import { PasswordStrength, VaultStatistics } from "../types/general";
import CircularProgress from "./CircularProgress";
import Icons from "./Icons";
import NumberTicker from "./NumberTicker";

const SecurityOverview = ({ statistics }: { statistics: VaultStatistics }) => {
    const healthDetails = useMemo(() => {
        const score = Math.round(statistics.security.health * 100);

        if (score >= 85) {
            return {
                label: "Excellent, keep it up!",
                tone: "excellent",
                description: "Most of your passwords are strong and well-protected. Your digital life is in great shape!",
            };
        }

        if (score >= 65) {
            return {
                label: "Pretty good!",
                tone: "good",
                description: "Passwords are generally safe, but there's room for improvement.",
            };
        }

        if (score >= 40) {
            return {
                label: "Needs attention",
                tone: "weak",
                description: "Several passwords are weak or outdated. Better change them!",
            };
        }

        return {
            label: "Critical!",
            tone: "critical",
            description: "Your password security is at high risk! Changing them is highly recommended.",
        };
    }, [statistics]);

    return (
        <div className="security">
            <h2 className="security__title">Security overview</h2>
            <Icons.ShieldLock className="security__icon" />

            <div className="security__sections">

                <div className="security__section security__section--health">
                    <div className="security__section-title">
                        <span>Password Health Score</span>
                        <span className="security__section-divider" />
                    </div>

                    <div className="security-health">
                        <div className="security-health__score">
                            <NumberTicker
                                className="security-health__value"
                                size={39}
                                number={Math.round(statistics.security.health * 100)}
                                mode="auto"
                            />

                            <CircularProgress
                                progress={Math.round(statistics.security.health * 100)}
                                size={120}
                                strokeWidth={10}
                                arcAngle={240}
                            />

                            <span className="security-health__scale">
                                Out of 100
                            </span>
                        </div>

                        <div className="security-health__details">
                            <div className={`security-health__label security-health__label--${healthDetails.tone}`}>{healthDetails.label}</div>
                            <div className={`security-health__text security-health__text--${healthDetails.tone}`}>{healthDetails.description}</div>
                        </div>
                    </div>
                </div>

                <div className="security__separator" />

                <div className="security__section security__section--distribution">
                    <div className="security__section-title">
                        <span>Strength Distribution</span>
                        <span className="security__section-divider" />
                    </div>

                    <div className="security-distribution">
                        <div className="security-distribution__bar">
                            {Object.keys(statistics.security.distribution).map(k => (
                                <div
                                    key={k}
                                    className={`security-distribution__segment security-distribution__segment--${k.toLowerCase()}`}
                                    style={{
                                        "--width": `${(
                                            statistics.security.distribution[k as PasswordStrength] * 100
                                        ).toFixed(2)}%`
                                    } as CSSProperties}
                                />
                            ))}
                        </div>
                        <div className="security-distribution__details">
                            {Object.keys(statistics.security.distribution)
                                .filter(k => statistics.security.distribution[k as PasswordStrength] > 0)
                                .map(k => {
                                    const percentage = Math.round(statistics.security.distribution[k as PasswordStrength] * 100);
                                    const count = statistics.security.strengths[k as PasswordStrength];
                                
                                    return <div
                                        key={k}
                                        className={`security-distribution__detail security-distribution__detail--${k.toLowerCase()}`}
                                    >
                                        <div className="security-distribution__dot" />
                                        <div className="security-distribution__label">{k}</div>
                                        <div className="security-distribution__value">
                                            <span className="security-distribution__percentage">{percentage}%</span>
                                            <span className="security-distribution__count">
                                                ({count})
                                            </span>
                                        </div>
                                    </div>
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityOverview;
