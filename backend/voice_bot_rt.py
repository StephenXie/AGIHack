# voice_bot.py
import outspeed as sp
import json

@sp.App()
class VoiceBot:
    async def setup(self) -> None:
        # Initialize the AI services
        self.deepgram_node = sp.DeepgramSTT(sample_rate=8000)
        self.llm_node = sp.GroqLLM(
            system_prompt="You are a helpful assistant. Keep your answers very short. No special characters in responses.",
        )
        self.token_aggregator_node = sp.TokenAggregator()
        self.tts_node = sp.CartesiaTTS(
            voice_id="95856005-0332-41b0-935f-352e296aa0df",
            api_key=os.getenv("CARTESIA_API_KEY")  # Ensure API key is loaded from environment
        )

    @sp.streaming_endpoint()
    async def run(self, audio_input_queue: sp.AudioStream, text_input_queue: sp.TextStream) -> sp.AudioStream:
        deepgram_stream: sp.TextStream = self.deepgram_node.run(audio_input_queue)

        text_input_queue = sp.map(text_input_queue, lambda x: json.loads(x).get("content"))

        llm_input_queue: sp.TextStream = sp.merge(
            [deepgram_stream, text_input_queue],
        )

        llm_token_stream, chat_history_stream = self.llm_node.run(llm_input_queue)

        token_aggregator_stream: sp.TextStream = self.token_aggregator_node.run(llm_token_stream)
        tts_stream: sp.AudioStream = self.tts_node.run(token_aggregator_stream)

        return tts_stream

    async def teardown(self) -> None:
        await self.deepgram_node.close()
        await self.llm_node.close()
        await self.token_aggregator_node.close()
        await self.tts_node.close()

if __name__ == "__main__":
    VoiceBot().start()
