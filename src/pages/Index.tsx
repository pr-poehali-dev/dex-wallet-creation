import { useState } from 'react';
import CreateWallet from '@/components/CreateWallet';
import SeedPhrase from '@/components/SeedPhrase';
import ConfirmSeed from '@/components/ConfirmSeed';
import CreateUsername from '@/components/CreateUsername';
import Welcome from '@/components/Welcome';
import MainWallet from '@/components/MainWallet';
import { generateWalletAddresses } from '@/utils/addressGenerator';

const Index = () => {
  const [step, setStep] = useState<'create' | 'seed' | 'confirm' | 'username' | 'welcome' | 'main'>('create');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<Map<string, string>>(new Map());

  const handleCreateWallet = () => {
    const newSeed = generateSeedPhrase();
    setSeedPhrase(newSeed);
    const addresses = generateWalletAddresses(newSeed);
    setWalletAddresses(addresses);
    setStep('seed');
  };

  const handleSeedSaved = () => {
    setStep('confirm');
  };

  const handleSeedConfirmed = () => {
    setStep('username');
  };

  const handleUsernameCreated = (name: string) => {
    setUsername(name);
    setStep('welcome');
  };

  const handleContinue = () => {
    setStep('main');
  };

  const generateSeedPhrase = (): string[] => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
    ];
    return Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]);
  };

  return (
    <div className="min-h-screen bg-background">
      {step === 'create' && <CreateWallet onNext={handleCreateWallet} />}
      {step === 'seed' && <SeedPhrase seedPhrase={seedPhrase} onNext={handleSeedSaved} onBack={() => setStep('create')} />}
      {step === 'confirm' && <ConfirmSeed seedPhrase={seedPhrase} onNext={handleSeedConfirmed} onBack={() => setStep('seed')} />}
      {step === 'username' && <CreateUsername onNext={handleUsernameCreated} onBack={() => setStep('confirm')} />}
      {step === 'welcome' && <Welcome username={username} onNext={handleContinue} />}
      {step === 'main' && <MainWallet username={username} walletAddresses={walletAddresses} />}
    </div>
  );
};

export default Index;