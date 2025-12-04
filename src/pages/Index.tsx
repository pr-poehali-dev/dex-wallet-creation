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
import { initTestBalances } from '@/utils/testBalances';
import { setBalances } from '@/utils/balanceManager';
import { setTransactions } from '@/utils/transactionManager';
import { createUser, getUser } from '@/utils/walletApi';
import { toast } from 'sonner';

const STORAGE_KEY = 'dex_wallet_data';
const USER_ID_KEY = 'dex_wallet_user_id';

const Index = () => {
  const [step, setStep] = useState<'choice' | 'create' | 'restore' | 'seed' | 'confirm' | 'username' | 'welcome' | 'main'>('choice');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const loadWallet = async () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          const savedUsername = data.username || '';
          
          if (savedUsername) {
            try {
              const userData = await getUser(savedUsername);
              
              if (userData) {
                const seedPhraseArray = userData.seed_phrase_encrypted.split(' ');
                setSeedPhrase(seedPhraseArray);
                setUsername(userData.username);
                
                const addressesMap = new Map(Object.entries(userData.addresses));
                setWalletAddresses(addressesMap);
                
                setBalances(userData.balances);
                
                localStorage.setItem(USER_ID_KEY, userData.user_id.toString());
                
                const updatedData = {
                  seedPhrase: seedPhraseArray,
                  username: userData.username,
                  addresses: userData.addresses
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
                
                setStep('main');
                return;
              }
            } catch (error) {
              console.error('Ошибка загрузки данных из БД:', error);
              toast.error('Ошибка загрузки данных кошелька');
            }
          }
          
          setSeedPhrase(data.seedPhrase || []);
          setUsername(savedUsername);
          
          let addressesMap = new Map(Object.entries(data.addresses || {}));
          
          if (data.seedPhrase && data.seedPhrase.length > 0) {
            const newAddresses = generateWalletAddresses(data.seedPhrase);
            addressesMap = newAddresses;
            
            const updatedData = {
              ...data,
              addresses: Object.fromEntries(newAddresses)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
          }
          
          setWalletAddresses(addressesMap);
          
          initTestBalances();
          
          setStep('main');
        } catch (error) {
          console.error('Ошибка загрузки данных кошелька:', error);
        }
      }
    };
    
    loadWallet();
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
    setWalletAddresses(addresses);
    setStep('seed');
  };

  const handleSeedSaved = () => {
    setStep('confirm');
  };

  const handleSeedConfirmed = () => {
    setStep('username');
  };

  const handleUsernameCreated = async (name: string) => {
    setUsername(name);
    saveWalletData(seedPhrase, name, walletAddresses);
    
    try {
      const addresses = Object.fromEntries(walletAddresses);
      const userId = await createUser(name, seedPhrase, addresses);
      localStorage.setItem(USER_ID_KEY, userId.toString());
      initTestBalances();
      toast.success('Кошелёк успешно создан и сохранён в базе данных');
    } catch (error) {
      console.error('Ошибка создания пользователя в БД:', error);
      toast.error('Ошибка сохранения кошелька, но вы можете продолжить работу');
    }
    
    setStep('welcome');
  };

  const handleContinue = () => {
    setStep('main');
  };

  const generateSeedPhrase = (): string[] => {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic.split(' ');
  };

  const handleRestoreWallet = async (mnemonic: string[]) => {
    setSeedPhrase(mnemonic);
    const addresses = generateWalletAddresses(mnemonic);
    setWalletAddresses(addresses);
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const savedSeedPhrase = data.seedPhrase?.join(' ');
        const currentSeedPhrase = mnemonic.join(' ');
        
        if (savedSeedPhrase === currentSeedPhrase) {
          const savedUsername = data.username || '';
          setUsername(savedUsername);
          saveWalletData(mnemonic, savedUsername, addresses);
          
          try {
            const userData = await getUser(savedUsername);
            if (userData) {
              setBalances(userData.balances);
              localStorage.setItem(USER_ID_KEY, userData.user_id.toString());
              toast.success('Кошелёк успешно восстановлен из базы данных');
            }
          } catch (error) {
            console.error('Ошибка загрузки данных из БД:', error);
            initTestBalances();
          }
          
          setStep('main');
          return;
        }
      } catch (error) {
        console.error('Ошибка проверки существующего кошелька:', error);
      }
    }
    
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