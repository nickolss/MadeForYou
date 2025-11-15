"use client";

import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

interface AdSpaceProps {
    /**
     * Tamanho do anúncio
     * - 'banner': Banner horizontal (728x90 ou similar)
     * - 'sidebar': Anúncio vertical para sidebar (300x250 ou similar)
     * - 'card': Card quadrado/retangular (300x300 ou similar)
     * - 'inline': Anúncio inline entre conteúdo (320x100 ou similar)
     */
    size?: 'banner' | 'sidebar' | 'card' | 'inline';
    /**
     * ID único do espaço de anúncio (para rastreamento)
     */
    adId?: string;
    /**
     * Classe CSS adicional
     */
    className?: string;
    /**
     * Se deve mostrar placeholder em desenvolvimento
     */
    showPlaceholder?: boolean;
}

const adSizes = {
    banner: { width: '100%', minHeight: 90, maxHeight: 250 },
    sidebar: { width: '100%', minHeight: 250, maxHeight: 600 },
    card: { width: '100%', minHeight: 300, maxHeight: 400 },
    inline: { width: '100%', minHeight: 100, maxHeight: 200 },
};

export function AdSpace({ 
    size = 'card', 
    adId = 'default',
    className,
    showPlaceholder = true 
}: AdSpaceProps) {
    const theme = useTheme();
    const [isProduction, setIsProduction] = useState(false);

    useEffect(() => {
        // Verifica se está em produção baseado na URL ou variável de ambiente
        setIsProduction(
            process.env.NODE_ENV === 'production' ||
            window.location.hostname !== 'localhost'
        );
    }, []);

    const dimensions = adSizes[size];
    const shouldShowAd = isProduction || showPlaceholder;

    if (!shouldShowAd) {
        return null;
    }

    return (
        <Paper
            elevation={0}
            className={className}
            sx={{
                width: dimensions.width,
                minHeight: dimensions.minHeight,
                maxHeight: dimensions.maxHeight,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : 'rgba(0, 0, 0, 0.02)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    borderColor: 'primary.main',
                },
                transition: 'all 0.2s',
            }}
        >
            {isProduction ? (
                // Em produção, aqui você pode integrar com Google AdSense, etc.
                <Box
                    id={`ad-${adId}`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* 
                        Exemplo de integração com Google AdSense:
                        <script
                            async
                            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
                            crossOrigin="anonymous"
                        />
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client="ca-pub-XXXXXXXXXX"
                            data-ad-slot="XXXXXXXXXX"
                            data-ad-format="auto"
                        />
                    */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            textAlign: 'center',
                            px: 2,
                        }}
                    >
                        Anúncio
                    </Typography>
                </Box>
            ) : (
                // Placeholder para desenvolvimento
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        p: 2,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            textAlign: 'center',
                            fontSize: '0.7rem',
                        }}
                    >
                        Espaço para Anúncio
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.disabled',
                            textAlign: 'center',
                            fontSize: '0.65rem',
                        }}
                    >
                        {size.toUpperCase()} • {adId}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.disabled',
                            textAlign: 'center',
                            fontSize: '0.6rem',
                        }}
                    >
                        {dimensions.minHeight}px × {dimensions.width}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

