export type ManifestationType = "text" | "audio" | "media";
export type ManifestationStatus = "recebida" | "em_analise" | "encaminhada" | "finalizada";

export interface Manifestation {
  id: string;
  protocol: string;
  type: ManifestationType;
  content?: string;
  audioBlob?: Blob;
  mediaFile?: File;
  mediaDescription?: string;
  isAnonymous: boolean;
  email?: string;
  name?: string;
  createdAt: string;
  status: ManifestationStatus;
  statusUpdatedAt: string;
}

export interface ManifestationWithStatus extends Omit<Manifestation, 'audioBlob' | 'mediaFile'> {}

// Generate a unique protocol number
export function generateProtocol(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900000) + 100000;
  
  return `PDF${year}${month}${day}-${random}`;
}

// Simulate a random status for demo purposes
function getRandomStatus(): ManifestationStatus {
  const statuses: ManifestationStatus[] = ['recebida', 'em_analise', 'encaminhada', 'finalizada'];
  const weights = [0.2, 0.35, 0.3, 0.15]; // More likely to be in analysis
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  return 'recebida';
}

// Save manifestation to localStorage (simulated persistence)
export function saveManifestation(manifestation: Omit<Manifestation, "id" | "protocol" | "createdAt" | "status" | "statusUpdatedAt">): Manifestation {
  const id = crypto.randomUUID();
  const protocol = generateProtocol();
  const createdAt = new Date().toISOString();
  
  const saved: Manifestation = {
    ...manifestation,
    id,
    protocol,
    createdAt,
    status: 'recebida',
    statusUpdatedAt: createdAt,
  };
  
  // Get existing manifestations
  const existing = localStorage.getItem("manifestations");
  const manifestations: Manifestation[] = existing ? JSON.parse(existing) : [];
  
  // Add new manifestation (without blobs for storage)
  const storeable = {
    ...saved,
    audioBlob: undefined,
    mediaFile: undefined,
  };
  manifestations.push(storeable);
  
  localStorage.setItem("manifestations", JSON.stringify(manifestations));
  
  return saved;
}

// Get all manifestations from localStorage
export function getManifestations(): ManifestationWithStatus[] {
  const existing = localStorage.getItem("manifestations");
  return existing ? JSON.parse(existing) : [];
}

// Get manifestation by protocol
export function getManifestationByProtocol(protocol: string): ManifestationWithStatus | null {
  const manifestations = getManifestations();
  const found = manifestations.find(m => m.protocol.toUpperCase() === protocol.toUpperCase());
  
  if (found) {
    // Simulate status progression for demo
    const createdDate = new Date(found.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    
    // Simulate status changes based on time elapsed (for demo)
    let simulatedStatus: ManifestationStatus = found.status;
    let statusDate = found.statusUpdatedAt;
    
    if (hoursDiff > 0.1) { // After ~6 minutes
      simulatedStatus = 'em_analise';
      statusDate = new Date(createdDate.getTime() + 6 * 60 * 1000).toISOString();
    }
    if (hoursDiff > 0.5) { // After ~30 minutes
      simulatedStatus = 'encaminhada';
      statusDate = new Date(createdDate.getTime() + 30 * 60 * 1000).toISOString();
    }
    if (hoursDiff > 2) { // After 2 hours
      simulatedStatus = 'finalizada';
      statusDate = new Date(createdDate.getTime() + 2 * 60 * 60 * 1000).toISOString();
    }
    
    return {
      ...found,
      status: simulatedStatus,
      statusUpdatedAt: statusDate,
    };
  }
  
  return null;
}
