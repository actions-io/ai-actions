"use client"
import {useCallback, useState, useMemo} from "react";
import styles from './page.module.css'
import { AppContextProvider } from '@/components/context-provider/app-context-provider';
import dynamic from "next/dynamic";

// Using dynamic here provides a quick & dirty solution for some 3rd party
// libraries that are using the browser API's which are not exist on the backend.
const BasePromptLayout = dynamic(
    () => import('@/examples/basic-prompt-layout/prompt-layout'),
    {
        loading: () => <p>Loading...</p>,

        ssr: false,
    }
);

export default function Home() {
  const  [displayedApp, setAppToDisplay] = useState('');

  const renderApp = useMemo(() => {
    return (<BasePromptLayout />);
  }, [displayedApp]);

  const renderExampleApp = (type= 'ContextExplorerExample') =>{
    setAppToDisplay(type);
  }

  return (
      <div className={styles.App}>
        <AppContextProvider>
          <>
            {renderApp}
          </>
        </AppContextProvider>
      </div>
  )
}


