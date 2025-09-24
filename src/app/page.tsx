import Scene3D from '@/components/Scene3D';
import { LoadingProvider } from '@/contexts/LoadingContext';

export default function Home() {
  return (
    <LoadingProvider>
      <Scene3D />
    </LoadingProvider>
  );
}
