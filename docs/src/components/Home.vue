<template>
    <div class="home">
        <h2>Developer</h2>
        <div class="user-list">
            <Avatar />
        </div>
        <h2>赞赏</h2>
        <div class="description">
            如果你觉得项目不错
            <br />可以请作者喝点
            <strong>饮品</strong>
        </div>
        <img
            class="zanshang"
            src="https://img.cdn.sugarat.top/mdImg/MTY0Nzc2MDE3MzM1NA==647760173354"
        />
        <div>微信赞赏码</div>
    </div>
</template>

<style scoped>
.home {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
h2 {
    opacity: 0.5;
}

.description {
    margin-top: 10px;
    text-align: center;
    line-height: 26px;
    opacity: 0.6;
}

.zanshang {
    width: 200px;
}
</style>
