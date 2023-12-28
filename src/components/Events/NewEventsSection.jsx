import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['events', { max: 2 }],
		queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
		staleTime: 5000,
		// gcTime: 30000// garbage collaction ile mimut będą przechowowyan domyślnie 5 minut
	});
	// queryFn w tej funcji zostanie wysłane rzeczywiste zapytanie do bazy
	// tanstack nie ma wbudowanej logiki wysyłania żadań http dlatego to musimy napisać sami, ma za to wbudowane zarządzanie danymi, obsługę błedów, cachowanie plików i inne
	//queryKey pomaga tanstakowi za kulisami wiedzieć co ma keszować, buforować i w ten sposób wyświetlać to szybciej korzystając z pamięci podręcznej. Klucz ten jest tablicą wartości które będą przechowywane wewnętrznie przez react Query

	let content;

	if (isPending) {
		content = <LoadingIndicator />;
	}

	if (isError) {
		content = <ErrorBlock title='An error occurred' message={error.info?.message || 'Failed to fetch events'} />;
	}

	if (data) {
		content = (
			<ul className='events-list'>
				{data.map(event => (
					<li key={event.id}>
						<EventItem event={event} />
					</li>
				))}
			</ul>
		);
	}

	return (
		<section className='content-section' id='new-events-section'>
			<header>
				<h2>Recently added events</h2>
			</header>
			{content}
		</section>
	);
}
