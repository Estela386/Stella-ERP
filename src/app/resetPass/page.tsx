"use client";

import { useState } from "react";
import ResetLayout from "./_components/ResetLayout";
import RequestEmailCard from "./_components/RequestEmailCard";
import EmailSentModal from "./_components/EmailSentModal";
import NewPasswordCard from "./_components/NewPasswordCard";
import { Step } from "./type";

export default function ResetPassPage() {
  const [step, setStep] = useState<Step>("REQUEST_EMAIL");
  const [showModal, setShowModal] = useState(false);

  return (
    <ResetLayout>

      {/* ===== PANTALLAS ===== */}

      {step === "REQUEST_EMAIL" && (
        <RequestEmailCard
          onSend={() => setShowModal(true)}
        />
      )}

      {step === "NEW_PASSWORD" && <NewPasswordCard />}


      {showModal && (
        <EmailSentModal
          onAccept={() => {
            setShowModal(false);
            setStep("NEW_PASSWORD");
          }}
          onClose={() => setShowModal(false)}
        />
      )}

    </ResetLayout>
  );
}