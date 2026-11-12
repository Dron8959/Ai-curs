// What the owner needs next to each post: why it exists, who forwards it, what is unconfirmed. From PLAN.md sections 5 and 7.
export const META = {
  1: { type: 'Proof', why: 'The main promise in three seconds; "drawing comes alive" is the best-proven format in the niche.', fwd: 'A mom sends it to dad or grandma.', },
  2: { type: 'Story', why: 'Before buying a kids\' product a parent looks at who is behind it. Pinned post.', fwd: 'A mom sends it to her partner.' },
  3: { type: 'Teach', why: 'Objection number one is safety. A reference post gets saved and forwarded.', fwd: 'A mom into the parents\' group chat, and to her partner.' },
  4: { type: 'Proof', why: 'Removes "I have no time": one evening, 39 minutes.', fwd: 'A mom to dad: "let\'s try it tonight".', hold: 'Waiting for Anna: is the 7:02 to 7:41 story really about Kamilla\'s game? If not, the reel is rebuilt without her name.' },
  5: { type: 'Opinion', why: 'A position people agree with and forward; it separates us from both "screens are evil" and "no AI means falling behind".', fwd: 'A mom to a friend or partner: "this is about us".' },
  6: { type: 'Teach', why: 'Explains the product in 15 seconds and removes "what would we even do".', fwd: 'A mom saves it for the night she tries lesson one.' },
  7: { type: 'Proof', why: 'The strongest proof and the strongest wish: "mine would love that". Pinned post.', fwd: 'A mom to her kid, or to grandma.' },
  8: { type: 'Opinion', why: 'Objection number two: "AI will make him lazy". The brand\'s main idea.', fwd: 'A mom to a skeptical partner or a teacher she knows.' },
  9: { type: 'Proof', why: 'Reviews from people who look like the viewer. Grandmothers open the gift question before the holidays.', fwd: 'A mom to her own mom.' },
  10: { type: 'Offer', why: 'The offer said plainly. Every other post leads here. Pinned post.', fwd: 'Saved or tapped, not forwarded.' },
};
