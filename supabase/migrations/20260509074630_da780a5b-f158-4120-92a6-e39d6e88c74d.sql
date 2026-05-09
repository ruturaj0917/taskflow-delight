-- Restrict Realtime channel subscriptions to the user's own topic
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can subscribe to own tasks channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = ('tasks:' || auth.uid()::text)
);