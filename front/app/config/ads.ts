export const adConfig = {
    /**
     * Habilita ou desabilita a exibição de anúncios
     * Em desenvolvimento, os placeholders ainda serão exibidos se showPlaceholder=true
     */
    enabled: process.env.NODE_ENV === 'production',
    
    /**
     * Mostra placeholders de anúncios mesmo em desenvolvimento
     * Útil para visualizar onde os anúncios aparecerão
     */
    showPlaceholder: true,
    
    /**
     * IDs dos espaços de anúncios para rastreamento
     * Use estes IDs para configurar seus anúncios nas plataformas de publicidade
     */
    adIds: {
        // Sidebar
        sidebarMain: 'sidebar-main',
        
        // Dashboard
        dashboardTop: 'dashboard-top',
        dashboardBottom: 'dashboard-bottom',
        
        // Tasks
        tasksTop: 'tasks-top',
        tasksBottom: 'tasks-bottom',
        
        // Projects
        projectsTop: 'projects-top',
        projectsBottom: 'projects-bottom',
        
        // Habits
        habitsTop: 'habits-top',
        habitsBottom: 'habits-bottom',
        
        // Notes
        notesTop: 'notes-top',
        notesBottom: 'notes-bottom',
        
        // Finances
        financesMiddle: 'finances-middle',
        financesBottom: 'finances-bottom',
    },
    
    /**
     * Configurações específicas por tamanho de anúncio
     */
    sizes: {
        banner: {
            width: '100%',
            minHeight: 90,
            maxHeight: 250,
            // Tamanhos padrão: 728x90 (Leaderboard), 970x250 (Billboard)
        },
        sidebar: {
            width: '100%',
            minHeight: 250,
            maxHeight: 600,
            // Tamanhos padrão: 300x250 (Medium Rectangle), 300x600 (Half Page)
        },
        card: {
            width: '100%',
            minHeight: 300,
            maxHeight: 400,
            // Tamanhos padrão: 300x300 (Square), 250x250 (Square)
        },
        inline: {
            width: '100%',
            minHeight: 100,
            maxHeight: 200,
            // Tamanhos padrão: 320x100 (Large Mobile Banner), 468x60 (Banner)
        },
    },

    slots: {
        'sidebar-main': '2751258209', 
        'dashboard-top': '1801138614',
        'dashboard-bottom': '6628468621',
        'tasks-top': '2405318430',
        'tasks-bottom': '3350024007',
        'projects-top': '5994043803',
        'projects-bottom': '2036942333',
        'habits-top': '',
        'habits-bottom': '',
        'notes-top': '',
        'notes-bottom': '',
        'finances-middle': '',
        'finances-bottom': ''
    },
};

/**
 * Exemplo de integração com Google AdSense:
 * 
 * 1. Adicione o script no layout principal (app/(app)/layout.tsx):
 * 
 * <script
 *     async
 *     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
 *     crossOrigin="anonymous"
 * />
 * 
 * 2. No componente AdSpace, adicione o código do anúncio:
 * 
 * <ins
 *     className="adsbygoogle"
 *     style={{ display: 'block' }}
 *     data-ad-client="ca-pub-XXXXXXXXXX"
 *     data-ad-slot="XXXXXXXXXX"
 *     data-ad-format="auto"
 *     data-full-width-responsive="true"
 * />
 * 
 * 3. Inicialize o anúncio após o mount:
 * 
 * useEffect(() => {
 *     if (window.adsbygoogle) {
 *         window.adsbygoogle.push({});
 *     }
 * }, []);
 */

