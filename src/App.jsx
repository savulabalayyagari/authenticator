import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import "./App.css";

import ToDo from "./ToDo";

Amplify.configure(awsExports);

export default function App() {
  return (
    <main className="auth-container">
      <Authenticator>
        {({ signOut, user }) => (
          <div className="auth-content">
            <ToDo userid={user.userId} username={user.username} />
            <button className="signout-btn" onClick={signOut}>
              Sign out
            </button>
          </div>
        )}
      </Authenticator>
    </main>
  );
}


