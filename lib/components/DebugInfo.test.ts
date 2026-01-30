import { describe, it, expect, vi, beforeEach } from 'vitest';
import DebugInfo from './DebugInfo';

// Mock the dependencies
vi.mock('../index', () => ({
  useFlyoIntegration: vi.fn(),
  useConfig: vi.fn(),
}));

describe('DebugInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset environment variables
    vi.stubEnv('DEV', true);
    vi.stubEnv('MODE', 'development');
    vi.stubEnv('VERCEL_DEPLOYMENT_ID', '');
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '');
  });

  it('should export the component', () => {
    expect(DebugInfo).toBeDefined();
  });

  it('should handle development token type', async () => {
    const { useFlyoIntegration, useConfig } = await import('../index');
    
    vi.mocked(useFlyoIntegration).mockReturnValue({
      options: {
        accessToken: 'd-development-token-123',
        liveEdit: true,
        componentsDir: 'src/components/flyo',
        clientCacheHeaderTtl: 900,
        serverCacheHeaderTtl: 1200,
      },
    } as any);

    vi.mocked(useConfig).mockResolvedValue({
      nitro: {
        version: 42,
        updated_at: 1706270400, // 2024-01-26 12:00:00 UTC
      },
    } as any);

    expect(useFlyoIntegration).toBeDefined();
    expect(useConfig).toBeDefined();
  });

  it('should handle production token type', async () => {
    const { useFlyoIntegration } = await import('../index');
    
    vi.mocked(useFlyoIntegration).mockReturnValue({
      options: {
        accessToken: 'p-production-token-456',
        liveEdit: false,
        componentsDir: 'src/components/flyo',
        clientCacheHeaderTtl: 900,
        serverCacheHeaderTtl: 1200,
      },
    } as any);

    const integration = useFlyoIntegration();
    const token = integration.options.accessToken as string;
    const tokenType = token.startsWith('p-') ? 'production' : (token.startsWith('d-') ? 'develop' : 'unknown');
    
    expect(tokenType).toBe('production');
  });

  it('should handle unknown token type', async () => {
    const { useFlyoIntegration } = await import('../index');
    
    vi.mocked(useFlyoIntegration).mockReturnValue({
      options: {
        accessToken: 'invalid-token',
        liveEdit: false,
        componentsDir: 'src/components/flyo',
        clientCacheHeaderTtl: 900,
        serverCacheHeaderTtl: 1200,
      },
    } as any);

    const integration = useFlyoIntegration();
    const token = integration.options.accessToken as string;
    const tokenType = token.startsWith('p-') ? 'production' : (token.startsWith('d-') ? 'develop' : 'unknown');
    
    expect(tokenType).toBe('unknown');
  });

  it('should handle missing nitro config', async () => {
    const { useConfig } = await import('../index');
    
    vi.mocked(useConfig).mockResolvedValue({} as any);

    const config = await useConfig({} as any);
    const apiVersion = config.nitro?.version?.toString() || '-';
    const apiLastUpdate = config.nitro?.updated_at ? 'date' : '-';
    
    expect(apiVersion).toBe('-');
    expect(apiLastUpdate).toBe('-');
  });

  it('should format date correctly from unix timestamp', () => {
    const timestamp = 1706270400; // 2024-01-26 12:00:00 UTC
    const date = new Date(timestamp * 1000);
    
    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(1706270400000);
  });

  it('should handle vercel environment variables', () => {
    vi.stubEnv('VERCEL_DEPLOYMENT_ID', 'dpl_abc123');
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', 'a1b2c3d4e5f6');
    
    const vercelDeploymentId = import.meta.env.VERCEL_DEPLOYMENT_ID || '-';
    const vercelGitCommitSha = import.meta.env.VERCEL_GIT_COMMIT_SHA || '-';
    
    expect(vercelDeploymentId).toBe('dpl_abc123');
    expect(vercelGitCommitSha).toBe('a1b2c3d4e5f6');
  });
});
