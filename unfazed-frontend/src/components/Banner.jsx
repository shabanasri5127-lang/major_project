import { Link } from "react-router-dom";

export default function Banner() {
	return (
		<>
			<style>{`
				.unfazed-hero {
					position: relative;
					display: flex;
					min-height: 480px;
					align-items: center;
					overflow: hidden;
					padding: clamp(32px, 8vw, 96px);
					border-radius: 24px;
					background: #151711;
					color: #f7f7f1;
					font-family: inherit;
					isolation: isolate;
				}
				.unfazed-hero::before,
				.unfazed-hero::after {
					position: absolute;
					z-index: -1;
					top: 50%;
					right: -115px;
					width: 430px;
					aspect-ratio: 1;
					border: 1px solid rgba(213, 255, 91, .28);
					border-radius: 50%;
					content: "";
					transform: translateY(-50%);
				}
				.unfazed-hero::after { width: 330px; border-color: rgba(213, 255, 91, .18); }
				.unfazed-hero-content { max-width: 700px; }
				.unfazed-hero-kicker {
					margin: 0 0 22px;
					color: #d5ff5b;
					font-size: 12px;
					font-weight: 700;
					letter-spacing: .18em;
					text-transform: uppercase;
				}
				.unfazed-hero-title {
					margin: 0;
					font-size: clamp(48px, 8vw, 92px);
					font-weight: 800;
					letter-spacing: -.07em;
					line-height: .96;
				}
				.unfazed-hero-title span { color: #d5ff5b; }
				.unfazed-hero-description {
					max-width: 420px;
					margin: 24px 0 30px;
					color: #c2c4bb;
					font-size: 16px;
					line-height: 1.7;
				}
				.unfazed-hero-link {
					display: inline-flex;
					min-height: 50px;
					align-items: center;
					gap: 12px;
					padding: 0 22px;
					border-radius: 999px;
					background: #d5ff5b;
					color: #151711;
					font-size: 14px;
					font-weight: 700;
					text-decoration: none;
					transition: transform .2s ease, background .2s ease;
				}
				.unfazed-hero-link:hover { transform: translateY(-2px); background: #e2ff8a; }
				@media (max-width: 600px) {
					.unfazed-hero { min-height: 420px; padding: 36px 26px; }
					.unfazed-hero::before, .unfazed-hero::after { right: -300px; }
				}
				@media (prefers-reduced-motion: reduce) { .unfazed-hero-link { transition: none; } }
			`}</style>
			<section className="unfazed-hero" aria-labelledby="unfazed-hero-title">
				<div className="unfazed-hero-content">
					<p className="unfazed-hero-kicker">Care that fits your life</p>
					<h1 className="unfazed-hero-title" id="unfazed-hero-title">
						Find the care you need.<br />Stay <span>well.</span>
					</h1>
					<p className="unfazed-hero-description">
						Connect with experienced doctors and book a consultation when it works for you.
					</p>
					<Link className="unfazed-hero-link" to="/doctors">
						Find a doctor <span aria-hidden="true">↗</span>
					</Link>
				</div>
			</section>
		</>
	);
}
