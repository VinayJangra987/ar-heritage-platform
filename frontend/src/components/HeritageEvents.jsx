import HeritageTicketReveal from '../components/HeritageTicketReveal/HeritageTicketReveal';

export default function HeritageEvents() {
  return (
    <HeritageTicketReveal
      variant="section"
      onReserve={(event) => {
        // yahan apna booking API call / navigate to checkout
      }}
    />
  );
}