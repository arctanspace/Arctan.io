export const metadata = { title: "Privacy Policy — Arctan" };
export default function Privacy() {
  return (
    <article className="prose">
      <h1>Privacy Policy — Arctan</h1>
      <p><strong>Effective date:</strong> 2025-11-06</p>
      <h2>What we access</h2>
      <ul>
        <li><code>gmail.readonly</code> to list threads/snippets and compute “your turn”.</li>
        <li><code>gmail.send</code> to send replies from Arctan.</li>
        <li><code>openid email profile</code> for authentication.</li>
      </ul>
      <h2>What we do not do</h2>
      <ul>
        <li>No selling or renting Gmail content.</li>
        <li>No training generalized AI/ML models on Gmail data.</li>
        <li>No logging of message bodies.</li>
      </ul>
      <h2>Storage &amp; retention</h2>
      <p>By default we do not persist message content; processing is in memory. Minimal non-content logs may be retained.</p>
      <h2>Security</h2>
      <ul>
        <li>HTTPS; secure cookies; server-only tokens.</li>
        <li>Least-privilege scopes (<code>gmail.readonly</code>, <code>gmail.send</code>).</li>
      </ul>
      <h2>Your choices</h2>
      <ul>
        <li>Revoke access in your Google Account.</li>
        <li>Email privacy@yourdomain.com for deletion requests.</li>
      </ul>
      <h2>Contact</h2>
      <p>privacy@yourdomain.com</p>
    </article>
  );
}

