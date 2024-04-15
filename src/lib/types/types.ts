export type LangCode = 'en' | 'fr' | 'de' | 'es' | 'pt' | 'it' | 'af' | 'ms' | 'id';
export type IllustrationStyle =
	| 'none'
	| 'Corry Loftis'
	| 'Jerry Pinkney'
	| 'Jim Toomey'
	| 'Lois Von Baarle'
	| 'Martin Rowson'
	| 'Posy Simmonds'
	| 'Tatsuro Kiuchi';
export type StoryData = {
	id: string;
	text: Record<
		'en',
		{
			title: string;
			content: string;
		}
	> &
		Partial<
			Record<
				LangCode,
				{
					title: string;
					content: string;
				}
			>
		>;
	illustration: {
		imagePrompt: string;
		selectedStyle: IllustrationStyle;
		styles: Record<'none', { url: string }> & Partial<Record<IllustrationStyle, { url: string }>>;
	};
	contentFilter: {
		text: 'safe' | 'unsafe';
		illustration: 'safe' | 'unsafe';
	}
};
export type StoryPromptInput = {
	genre: string;
	character: string;
	location: string;
	tone: string;
	theme: string;
	extraPrompt: string;
};
