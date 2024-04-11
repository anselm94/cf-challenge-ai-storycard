export type LangCode = 'en' | 'de' | 'es';
export type IllustrationStyle = 'none' | 'artistic' | 'comic';
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
		selectedStyle: IllustrationStyle;
		styles: Record<'none', { url: string }> & Partial<Record<IllustrationStyle, { url: string }>>;
	};
};
