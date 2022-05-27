import { create, act} from 'react-test-renderer';
import Progress from '../component/Progress';

it('progress bar width must be the calculation from two variables', () => {
	const component = create(
		<Progress
			totalUniqueVisits={{ current:4 }}
			totalRounds={40}
		/>
	);
	expect(component.toJSON()).toMatchSnapshot();

	act(() => {
		component.update(
			<Progress
				totalUniqueVisits={{ current: 20 }}
				totalRounds={40}
			/>
		)
	});

	expect(component.toJSON()).toMatchSnapshot();

	act(() => {
		component.update(
			<Progress
				totalUniqueVisits={{ current: 40 }}
				totalRounds={40}
			/>
		)
	});

	expect(component.toJSON()).toMatchSnapshot();
})