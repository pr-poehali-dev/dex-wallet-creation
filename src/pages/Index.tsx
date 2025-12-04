import { useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import WalletChoice from '@/components/WalletChoice';
import CreateWallet from '@/components/CreateWallet';
import RestoreWallet from '@/components/RestoreWallet';
import SeedPhrase from '@/components/SeedPhrase';
import ConfirmSeed from '@/components/ConfirmSeed';
import CreateUsername from '@/components/CreateUsername';
import Welcome from '@/components/Welcome';
import MainWallet from '@/components/MainWallet';
import { generateWalletAddresses } from '@/utils/addressGenerator';

const STORAGE_KEY = 'dex_wallet_data';

const Index = () => {
  const [step, setStep] = useState<'choice' | 'create' | 'restore' | 'seed' | 'confirm' | 'username' | 'welcome' | 'main'>('choice');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSeedPhrase(data.seedPhrase || []);
        setUsername(data.username || '');
        
        let addressesMap = new Map(Object.entries(data.addresses || {}));
        
        if (data.seedPhrase && data.seedPhrase.length > 0) {
          const newAddresses = generateWalletAddresses(data.seedPhrase);
          addressesMap = newAddresses;
          
          const updatedData = {
            ...data,
            addresses: Object.fromEntries(newAddresses)
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
          console.log('Addresses migrated, TRC20:', newAddresses.get('TRC20'));
        }
        
        setWalletAddresses(addressesMap);
        setStep('main');
      } catch (error) {
        console.error('Ошибка загрузки данных кошелька:', error);
      }
    }
  }, []);

  const saveWalletData = (seed: string[], name: string, addresses: Map<string, string>) => {
    const data = {
      seedPhrase: seed,
      username: name,
      addresses: Object.fromEntries(addresses)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleCreateWallet = () => {
    const newSeed = generateSeedPhrase();
    setSeedPhrase(newSeed);
    const addresses = generateWalletAddresses(newSeed);
    console.log('Generated addresses:', Array.from(addresses.entries()));
    console.log('TRC20 address:', addresses.get('TRC20'));
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
    saveWalletData(seedPhrase, name, walletAddresses);
    setStep('welcome');
  };

  const handleContinue = () => {
    setStep('main');
  };

  const generateSeedPhrase = (): string[] => {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic.split(' ');
  };

  const handleRestoreWallet = (mnemonic: string[]) => {
    setSeedPhrase(mnemonic);
    const addresses = generateWalletAddresses(mnemonic);
    console.log('Restored addresses:', Array.from(addresses.entries()));
    console.log('TRC20 address:', addresses.get('TRC20'));
    setWalletAddresses(addresses);
    setStep('username');
  };

  return (
    <div className="min-h-screen bg-background">
      {step === 'choice' && (
        <WalletChoice 
          onCreateNew={() => setStep('create')} 
          onRestore={() => setStep('restore')} 
        />
      )}
      {step === 'create' && <CreateWallet onNext={handleCreateWallet} onBack={() => setStep('choice')} />}
      {step === 'restore' && <RestoreWallet onNext={handleRestoreWallet} onBack={() => setStep('choice')} />}
      {step === 'seed' && <SeedPhrase seedPhrase={seedPhrase} onNext={handleSeedSaved} onBack={() => setStep('create')} />}
      {step === 'confirm' && <ConfirmSeed seedPhrase={seedPhrase} onNext={handleSeedConfirmed} onBack={() => setStep('seed')} />}
      {step === 'username' && <CreateUsername onNext={handleUsernameCreated} onBack={() => step === 'restore' ? setStep('restore') : setStep('confirm')} />}
      {step === 'welcome' && <Welcome username={username} onNext={handleContinue} />}
      {step === 'main' && <MainWallet username={username} walletAddresses={walletAddresses} />}
    </div>
  );
};

export default Index;